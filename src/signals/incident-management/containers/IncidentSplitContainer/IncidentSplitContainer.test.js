// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { render as reactRender, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import { showGlobalNotification } from 'containers/App/actions'
import {
  VARIANT_SUCCESS,
  VARIANT_ERROR,
  TYPE_LOCAL,
} from 'containers/Notification/constants'
import * as categoriesSelectors from 'models/categories/selectors'
import * as departmentsSelectors from 'models/departments/selectors'
import configuration from 'shared/services/configuration/configuration'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import { withAppContext } from 'test/utils'
import {
  directingDepartments,
  subcategoriesGroupedByCategories,
} from 'utils/__tests__/fixtures'
import departmentsFixture from 'utils/__tests__/fixtures/departments.json'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import IncidentSplitContainer from '.'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

const navigateMock = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateMock)

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}))

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}))

const departments = {
  ...departmentsFixture,
  count: departmentsFixture.count,
  list: departmentsFixture.results,
  results: undefined,
}

const submittedFormData = {
  department: 'ASC',
  incidents: [
    {
      description: 'Foo bar',
      category_url:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
      priority: 'high',
      type: 'SIG',
    },
    {
      description: 'Bar baz',
      category_url:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/openbaar-groen-en-water/sub_categories/japanse-duizendknoop',
      priority: 'normal',
      type: 'REQ',
    },
    {
      description: 'Zork!!!1!',
      category_url:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/huisafval',
      priority: 'low',
      type: 'COM',
    },
  ],
  noteText: 'Nieuwe notitie',
}

const id = 999

// render a component, await a rendered element and return the render result
const renderAwait = async (
  component,
  testIdToLookFor = 'incident-split-container'
) => {
  const renderResult = reactRender(withAppContext(component))

  await renderResult.findByTestId(testIdToLookFor)

  return renderResult
}

const Form =
  (formData = submittedFormData) =>
  // making sure that the <form> elements doesn't print unsupported attributes
  ({
    onSubmit,
    // eslint-disable-next-line no-unused-vars
    parentIncident,
    // eslint-disable-next-line no-unused-vars
    directingDepartments,
    // eslint-disable-next-line no-unused-vars
    isSubmitting,
    ...props
  }) => {
    const handleSubmit = (e) => {
      // preventing default form submission behaviour to suppress warning in the test console log
      e.preventDefault()
      onSubmit(formData)
    }

    return (
      <form onSubmit={handleSubmit} {...props}>
        <input type="submit" value="Submit" />
      </form>
    )
  }
const formComponentMock = { render: Form() }

describe('signals/incident-management/containers/IncidentSplitContainer', () => {
  const renderSpy = jest.spyOn(formComponentMock, 'render')

  beforeEach(() => {
    dispatch.mockReset()
    navigateMock.mockReset()
    fetch.resetMocks()

    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories)
    jest
      .spyOn(departmentsSelectors, 'makeSelectDepartments')
      .mockImplementation(() => departments)
    jest
      .spyOn(departmentsSelectors, 'makeSelectDirectingDepartments')
      .mockImplementation(() => directingDepartments)

    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({ id }))

    fetch.once(JSON.stringify(incidentFixture))
  })

  it('should render loading indicator', async () => {
    const { getByTestId, findByTestId, queryByTestId } = reactRender(
      withAppContext(
        <IncidentSplitContainer FormComponent={formComponentMock.render} />
      )
    )

    expect(getByTestId('loading-indicator')).toBeInTheDocument()

    await findByTestId('incident-split-container')

    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument()
  })

  it('should request incident data on mount', async () => {
    await renderAwait(
      <IncidentSplitContainer FormComponent={formComponentMock.render} />
    )

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('should render the form on successful fetch', async () => {
    const directingDepartment = 'null'
    const { queryByTestId } = await renderAwait(
      <IncidentSplitContainer FormComponent={formComponentMock.render} />
    )

    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        parentIncident: expect.objectContaining({ directingDepartment }),
      }),
      expect.any(Object)
    )
    expect(queryByTestId('incident-split-form')).toBeInTheDocument()
  })

  it('should render the form on successful fetch with directing_department set', async () => {
    const directingDepartment = departments.list[0].code
    const incident = {
      ...incidentFixture,
      directing_departments: [departments.list[0]],
      _links: null,
    }
    fetch.resetMocks()
    fetch.once(JSON.stringify(incident))

    const { queryByTestId } = await renderAwait(
      <IncidentSplitContainer FormComponent={formComponentMock.render} />
    )
    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        parentIncident: expect.objectContaining({ directingDepartment }),
      }),
      expect.any(Object)
    )
    expect(queryByTestId('incident-split-form')).toBeInTheDocument()
  })

  it('should render the form on successful fetch with directing_departments set on an non directing department ', async () => {
    const directingDepartment = 'null'
    const incident = {
      ...incidentFixture,
      directing_departments: [departments.list[1]],
    }
    fetch.resetMocks()
    fetch.once(JSON.stringify(incident))

    const { queryByTestId } = await renderAwait(
      <IncidentSplitContainer FormComponent={formComponentMock.render} />
    )

    expect(renderSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        parentIncident: expect.objectContaining({ directingDepartment }),
      }),
      expect.any(Object)
    )
    expect(queryByTestId('incident-split-form')).toBeInTheDocument()
  })

  it('should POST the form data', async () => {
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      [JSON.stringify({}), { status: 201 }], // post
      [JSON.stringify({}), { status: 200 }] // patch
    )

    reactRender(
      withAppContext(<IncidentSplitContainer FormComponent={Form()} />)
    )

    expect(fetch).toHaveBeenCalledTimes(1)

    const submitButton = await screen.findByRole('button', { name: 'Submit' })
    userEvent.click(submitButton)

    await screen.findByTestId('incident-split-form')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3)
    })

    expect(fetch).toHaveBeenCalledWith(
      configuration.INCIDENT_PRIVATE_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    )

    const { stadsdeel, buurt_code, address, geometrie } =
      incidentFixture.location

    const parentData = {
      attachments: incidentFixture.attachments,
      extra_properties: incidentFixture.extra_properties,
      incident_date_end: incidentFixture.incident_date_end,
      incident_date_start: incidentFixture.incident_date_start,
      location: { stadsdeel, buurt_code, address, geometrie },
      reporter: incidentFixture.reporter,
      source: incidentFixture.source,
      text_extra: incidentFixture.text_extra,
      parent: incidentFixture.id,
    }

    const expectedTransformedBecauseOfReasonsUnknownToManValues =
      submittedFormData.incidents.map(
        ({ subcategory, description, type, priority }) => ({
          category: { category_url: subcategory },
          priority: { priority },
          text: description,
          type: { code: type },
        })
      )

    JSON.parse(fetch.mock.calls[1][1].body).forEach(
      (partialIncidentData, index) => {
        expect(partialIncidentData).toEqual(
          expect.objectContaining(
            expectedTransformedBecauseOfReasonsUnknownToManValues[index]
          )
        )
        expect(partialIncidentData).toEqual(expect.objectContaining(parentData))
      }
    )
  })

  it('should PATCH the parent incident data', async () => {
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      [JSON.stringify({}), { status: 201 }], // post
      [JSON.stringify({}), { status: 200 }] // patch
    )
    reactRender(
      withAppContext(<IncidentSplitContainer FormComponent={Form()} />)
    )
    const submitButton = await screen.findByRole('button', { name: 'Submit' })

    userEvent.click(submitButton)

    // trigger extra render where PATCH effect is triggered
    await screen.findByTestId('incident-split-container')

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            directing_departments: [
              {
                id: departmentsFixture.results.find(
                  (department) =>
                    department.code === submittedFormData.department
                ).id,
              },
            ],
            notes: [{ text: submittedFormData.noteText }],
          }),
        })
      )
    })
  })

  it('should not PATCH the parent incident data when this data has not been updated', async () => {
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      [JSON.stringify({}), { status: 201 }] // post
    )
    reactRender(
      withAppContext(
        <IncidentSplitContainer
          FormComponent={Form({
            ...submittedFormData,
            department: 'null',
            noteText: '',
          })}
        />
      )
    )

    const submitButton = await screen.findByRole('button', { name: 'Submit' })
    userEvent.click(submitButton)

    // trigger extra render where PATCH effect is triggered
    await screen.findByTestId('incident-split-container')

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
      expect.objectContaining({
        method: 'PATCH',
      })
    )
  })

  it('should display a global notification on success', async () => {
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      [JSON.stringify({}), { status: 201 }], // post
      [JSON.stringify({}), { status: 200 }] // patch
    )
    const { findByTestId } = await renderAwait(
      <IncidentSplitContainer
        FormComponent={Form({ ...submittedFormData, department: null })}
      />
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    const submitButton = await screen.findByRole('button', { name: 'Submit' })
    userEvent.click(submitButton)

    await findByTestId('incident-split-container')

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification({
          title: 'Deelmelding gemaakt',
          variant: VARIANT_SUCCESS,
          type: TYPE_LOCAL,
        })
      )
    })

    expect(navigateMock).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`)
  })

  it('should display a global notification on POST fail', async () => {
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      ['', { status: 400, ok: false, statusText: 'Bad Request' }] // post
    )

    const { findByTestId } = await renderAwait(
      <IncidentSplitContainer FormComponent={formComponentMock.render} />
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    const submitButton = await screen.findByRole('button', { name: 'Submit' })
    userEvent.click(submitButton)

    await findByTestId('incident-split-form')

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification({
          title: 'De deelmelding kon niet gemaakt worden',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    })

    expect(navigateMock).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`)
  })

  it('should display a global notification on PATCH fail', async () => {
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(incidentFixture), { status: 200 }], // get
      [JSON.stringify({}), { status: 201 }], // post
      ['', { status: 400, ok: false, statusText: 'Bad Request' }] // patch
    )

    const { findByTestId } = await renderAwait(
      <IncidentSplitContainer FormComponent={formComponentMock.render} />
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(navigateMock).not.toHaveBeenCalled()

    const submitButton = await screen.findByRole('button', { name: 'Submit' })
    userEvent.click(submitButton)

    await findByTestId('incident-split-form')

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification({
          title: 'Deelmelding gemaakt',
          variant: VARIANT_SUCCESS,
          type: TYPE_LOCAL,
        })
      )
    })

    expect(navigateMock).toHaveBeenCalledWith(`${INCIDENT_URL}/${id}`)
  })
})
