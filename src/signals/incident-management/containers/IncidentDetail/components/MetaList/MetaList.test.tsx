// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { fetchCategoriesSuccess } from 'models/categories/actions'
import * as categoriesSelectors from 'models/categories/selectors'
import * as departmentsSelectors from 'models/departments/selectors'
import configuration from 'shared/services/configuration/configuration'
import { string2date, string2time } from 'shared/services/string-parser'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import { store, withAppContext } from 'test/utils'
import { StatusCode } from 'types/status-code'
import {
  departments,
  directingDepartments,
  handlingTimesBySlug,
  subcategoriesGroupedByCategories,
} from 'utils/__tests__/fixtures'
import autocompleteUsernamesFixture from 'utils/__tests__/fixtures/autocompleteUsernames.json'
import categoriesPrivate from 'utils/__tests__/fixtures/categories_private.json'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import MetaList from './MetaList'
import * as API from '../../../../../../../internals/testing/api'
import {
  mockRequestHandler,
  fetchMock,
} from '../../../../../../../internals/testing/msw-server'
import IncidentDetailContext from '../../context'
import type { IncidentChild } from '../../types'

fetchMock.disableMocks()
jest.mock('shared/services/configuration/configuration')
jest.mock('shared/services/string-parser')

store.dispatch(fetchCategoriesSuccess(categoriesPrivate))

const update = jest.fn()
const edit = jest.fn()
const close = jest.fn()
const departmentAscId = departments.list[0].id
const departmentAscCode = departments.list[0].code
const departmentAscName = departments.list[0].name
const departmentAegCode = departments.list[1].code
const departmentAegName = departments.list[1].name
const departmentThoId = departments.list[11].id
const departmentThoCode = departments.list[11].code
const departmentThoName = departments.list[11].name
const {
  results: [
    { username: autocompleteUsernamesAscName },
    { username: autocompleteUsernamesAegName },
    { username: autocompleteUsernamesThoName },
    { username: autocompleteUsernamesAscAegName },
    { username: autocompleteUsernamesEmptyName },
  ],
} = autocompleteUsernamesFixture

const plainLinks = Object.keys(incidentFixture._links)
  .filter((link) => !['sia:children', 'sia:parent'].includes(link))
  .reduce(
    (acc, key) => ({
      ...acc,
      [key]: { ...(incidentFixture as any)._links[key] },
    }),
    {}
  )

const plainIncident = { ...incidentFixture, _links: { ...plainLinks } }
const parentIncident = { ...incidentFixture }
const childIncident = {
  ...plainIncident,
  _links: { ...plainLinks, 'sia:parent': { href: 'http://parent-link' } },
}

const defaultTexts = [
  {
    state: StatusCode.Ingepland,
    templates: [],
  },
  {
    state: StatusCode.Afgehandeld,
    templates: [],
  },
]

const renderWithContext = (
  incident: any = parentIncident,
  childIncidents: IncidentChild[] = []
) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update, edit, close }}>
      <MetaList defaultTexts={defaultTexts} childIncidents={childIncidents} />
    </IncidentDetailContext.Provider>
  )

describe('MetaList', () => {
  beforeEach(() => {
    update.mockReset()
    edit.mockReset()
    ;(string2date as jest.Mock<any>).mockImplementation(() => '21-07-1970')
    ;(string2time as jest.Mock<any>).mockImplementation(() => '11:56')

    jest
      .spyOn(departmentsSelectors, 'makeSelectDepartments')
      .mockImplementation(() => departments)
    jest
      .spyOn(categoriesSelectors, 'makeSelectSubcategoriesGroupedByCategories')
      .mockImplementation(() => subcategoriesGroupedByCategories)
    jest
      .spyOn(categoriesSelectors, 'makeSelectHandlingTimesBySlug')
      .mockImplementation(() => handlingTimesBySlug as any)
  })

  afterEach(() => (configuration as unknown as any).__reset())

  describe('rendering', () => {
    it('should render correctly a plain incident', () => {
      render(renderWithContext(plainIncident))

      expect(
        screen.queryByTestId('meta-list-date-definition')
      ).toHaveTextContent(/^Gemeld op$/)
      expect(screen.queryByTestId('meta-list-date-value')).toHaveTextContent(
        /^21-07-1970 11:56$/
      )

      expect(
        screen.queryByTestId('meta-list-handling-time-definition')
      ).toHaveTextContent(/^Afhandeltermijn$/)
      expect(
        screen.queryByTestId('meta-list-handling-time-value')
      ).toHaveTextContent(/^4 werkdagen$/)

      expect(
        screen.queryByTestId('meta-list-process-time-definition')
      ).toHaveTextContent(/^Doorlooptijd$/)
      expect(
        screen.queryByTestId('meta-list-process-time-value')
      ).toHaveTextContent(/^3x buiten de afhandeltermijn$/)

      expect(
        screen.queryByTestId('meta-list-status-definition')
      ).toHaveTextContent(/^Status$/)
      expect(screen.queryByTestId('meta-list-status-value')).toHaveTextContent(
        /^Gemeld$/
      )

      expect(screen.queryByText('Urgentie')).toBeInTheDocument()
      expect(screen.queryByText('Normaal')).toBeInTheDocument()

      expect(
        screen.queryByTestId('meta-list-main-category-definition')
      ).toHaveTextContent(/^Hoofdcategorie$/)
      expect(
        screen.queryByTestId('meta-list-main-category-value')
      ).toHaveTextContent(incidentFixture.category.main)

      expect(
        screen.queryByTestId('meta-list-source-definition')
      ).toHaveTextContent(/^Bron$/)
      expect(screen.queryByTestId('meta-list-source-value')).toHaveTextContent(
        incidentFixture.source
      )

      expect(
        screen.queryByTestId('meta-list-parent-definition')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('meta-list-parent-value')
      ).not.toBeInTheDocument()

      expect(
        screen.queryByTestId('meta-list-directing_departments-definition')
      ).not.toBeInTheDocument()
    })

    it('should render correctly a parent incident', () => {
      render(renderWithContext(parentIncident))

      expect(
        screen.queryByTestId('meta-list-date-definition')
      ).toHaveTextContent(/^Gemeld op$/)
      expect(screen.queryByTestId('meta-list-date-value')).toHaveTextContent(
        /^21-07-1970 11:56$/
      )

      expect(
        screen.queryByTestId('meta-list-handling-time-definition')
      ).toHaveTextContent(/^Afhandeltermijn$/)
      expect(
        screen.queryByTestId('meta-list-handling-time-value')
      ).toHaveTextContent(/^4 werkdagen$/)

      expect(
        screen.queryByTestId('meta-list-status-definition')
      ).toHaveTextContent(/^Status$/)
      expect(screen.queryByTestId('meta-list-status-value')).toHaveTextContent(
        /^Gemeld$/
      )

      expect(screen.queryByText('Urgentie')).toBeInTheDocument()
      expect(screen.queryByText('Normaal')).toBeInTheDocument()

      expect(
        screen.queryByTestId('meta-list-main-category-definition')
      ).toHaveTextContent(/^Hoofdcategorie$/)
      expect(
        screen.queryByTestId('meta-list-main-category-value')
      ).toHaveTextContent(incidentFixture.category.main)

      expect(
        screen.queryByTestId('meta-list-source-definition')
      ).toHaveTextContent(/^Bron$/)
      expect(screen.queryByTestId('meta-list-source-value')).toHaveTextContent(
        incidentFixture.source
      )

      expect(
        screen.queryByTestId('meta-list-parent-definition')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('meta-list-parent-value')
      ).not.toBeInTheDocument()

      expect(
        screen.queryByTestId('meta-list-directing_departments-definition')
      ).toBeInTheDocument()
    })

    it('should render correctly a child incident', () => {
      render(renderWithContext(childIncident))

      expect(
        screen.queryByTestId('meta-list-date-definition')
      ).toHaveTextContent(/^Gemeld op$/)
      expect(screen.queryByTestId('meta-list-date-value')).toHaveTextContent(
        /^21-07-1970 11:56$/
      )

      expect(
        screen.queryByTestId('meta-list-status-definition')
      ).toHaveTextContent(/^Status$/)
      expect(screen.queryByTestId('meta-list-status-value')).toHaveTextContent(
        /^Gemeld$/
      )

      expect(screen.queryByText('Urgentie')).toBeInTheDocument()
      expect(screen.queryByText('Normaal')).toBeInTheDocument()

      expect(
        screen.queryByTestId('meta-list-main-category-definition')
      ).toHaveTextContent(/^Hoofdcategorie$/)
      expect(
        screen.queryByTestId('meta-list-main-category-value')
      ).toHaveTextContent(incidentFixture.category.main)

      expect(
        screen.queryByTestId('meta-list-source-definition')
      ).toHaveTextContent(/^Bron$/)
      expect(screen.queryByTestId('meta-list-source-value')).toHaveTextContent(
        incidentFixture.source
      )

      expect(
        screen.queryByTestId('meta-list-parent-definition')
      ).toHaveTextContent(/^Hoofdmelding$/)
      expect(screen.queryByTestId('meta-list-parent-value')).toHaveTextContent(
        /^parent-link$/
      )
      // expect(screen.queryByTestId('meta-list-parent-link')).toHaveAttribute('href', /^\/manage\/incident\/parent-link$/);
      expect(screen.queryByTestId('meta-list-parent-link')).toHaveAttribute(
        'href',
        `/${INCIDENT_URL}/parent-link`
      )

      expect(
        screen.queryByTestId('meta-list-directing_departments-definition')
      ).not.toBeInTheDocument()
    })
  })

  it('should render days and workdays in single and plural form', () => {
    const { rerender } = render(renderWithContext(plainIncident))

    expect(
      screen.queryByTestId('meta-list-handling-time-definition')
    ).toHaveTextContent(/^Afhandeltermijn$/)
    expect(
      screen.queryByTestId('meta-list-handling-time-value')
    ).toHaveTextContent(/^4 werkdagen$/)

    rerender(
      renderWithContext({
        ...plainIncident,
        category: { sub_slug: 'beplanting' },
      })
    )
    expect(
      screen.queryByTestId('meta-list-handling-time-definition')
    ).toHaveTextContent(/^Afhandeltermijn$/)
    expect(
      screen.queryByTestId('meta-list-handling-time-value')
    ).toHaveTextContent(/^1 werkdag$/)

    rerender(
      renderWithContext({
        ...plainIncident,
        category: { sub_slug: 'bewegwijzering' },
      })
    )
    expect(
      screen.queryByTestId('meta-list-handling-time-definition')
    ).toHaveTextContent(/^Afhandeltermijn$/)
    expect(
      screen.queryByTestId('meta-list-handling-time-value')
    ).toHaveTextContent(/^1 dag$/)

    rerender(
      renderWithContext({
        ...plainIncident,
        category: { sub_slug: 'autom-verzinkbare-palen' },
      })
    )
    expect(
      screen.queryByTestId('meta-list-handling-time-definition')
    ).toHaveTextContent(/^Afhandeltermijn$/)
    expect(
      screen.queryByTestId('meta-list-handling-time-value')
    ).toHaveTextContent(/^21 dagen$/)
  })

  it('should render process time copy based on the deadline and current time', async () => {
    const now = new Date()
    const before = new Date(now.getTime() - 100)
    const after = new Date(now.getTime() + 100)

    const { rerender } = render(
      renderWithContext({
        ...plainIncident,
        category: {
          ...plainIncident.category,
          deadline: before.toISOString(),
          deadline_factor_3: undefined,
        },
      })
    )
    expect(
      screen.queryByTestId('meta-list-process-time-definition')
    ).toHaveTextContent(/^Doorlooptijd$/)
    expect(
      screen.queryByTestId('meta-list-process-time-value')
    ).toHaveTextContent(/^Buiten de afhandeltermijn$/)
    expect(
      screen.queryByTestId('meta-list-process-time-value')?.className
    ).toBe('alert')

    rerender(
      renderWithContext({
        ...plainIncident,
        category: {
          ...plainIncident.category,
          deadline: after.toISOString(),
          deadline_factor_3: undefined,
        },
      })
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('meta-list-process-time-definition')
      ).toHaveTextContent(/^Doorlooptijd$/)
      expect(
        screen.queryByTestId('meta-list-process-time-value')
      ).toHaveTextContent(/^Binnen de afhandeltermijn$/)
      expect(
        screen.queryByTestId('meta-list-process-time-value')?.className
      ).toBe('')
    })
    rerender(
      renderWithContext({
        ...plainIncident,
        category: {
          ...plainIncident.category,
          deadline_factor_3: before.toISOString(),
        },
      })
    )
    expect(
      screen.queryByTestId('meta-list-process-time-definition')
    ).toHaveTextContent(/^Doorlooptijd$/)
    expect(
      screen.queryByTestId('meta-list-process-time-value')
    ).toHaveTextContent(/^3x buiten de afhandeltermijn$/)
    expect(
      screen.queryByTestId('meta-list-process-time-value')?.className
    ).toBe('alert')
  })

  it('should render process time copy based on the deadline and current status', () => {
    const statusChangeDate = new Date(1990)
    const after = new Date(statusChangeDate.getTime() + 100)

    render(
      renderWithContext({
        ...plainIncident,
        category: {
          deadline_factor_3: after.toISOString(),
        },
        status: {
          ...plainIncident.status,
          state: StatusCode.Afgehandeld,
          created_at: statusChangeDate.toISOString(),
        },
      })
    )

    expect(
      screen.queryByTestId('meta-list-process-time-value')
    ).toHaveTextContent(/^Binnen de afhandeltermijn$/)
  })

  it('should show the status form', () => {
    render(renderWithContext())

    expect(screen.queryByTestId('status-form')).not.toBeInTheDocument()

    const button = screen.queryByTestId('edit-status-button')

    if (button) {
      fireEvent.click(button)
    }

    expect(screen.queryByTestId('status-form')).toBeInTheDocument()
  })

  it('should call update', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        priority: { ...incidentFixture.priority, priority: 'high' },
      })
    )

    // priority button data-testid attribute is dynamically generated in the ChangeValue component:
    const editTestId = 'editPriorityButton'
    const submitTestId = 'submitPriorityButton'
    const editButtons = screen.getAllByTestId(editTestId)

    fireEvent.click(editButtons[0])

    const submitButtons = screen.getAllByTestId(submitTestId)

    expect(update).not.toHaveBeenCalled()

    fireEvent.click(submitButtons[0])

    expect(update).toHaveBeenCalledWith({
      patch: {
        priority: {
          priority: 'high',
        },
      },
      type: 'priority',
    })
  })

  describe('subcategory', () => {
    const subcategoryLabel = 'Subcategorie (verantwoordelijke afdeling)'
    const selectedSubcategory = /Asbest \/ accu/

    it('should be visible', () => {
      render(renderWithContext())

      expect(screen.getByText(subcategoryLabel)).toBeInTheDocument()
      expect(screen.getByText(selectedSubcategory)).toBeInTheDocument()
    })

    it('should not be visible without subcategories available', () => {
      jest
        .spyOn(
          categoriesSelectors,
          'makeSelectSubcategoriesGroupedByCategories'
        )
        .mockImplementation(() => [[], []])
      render(renderWithContext())

      expect(screen.queryByText(subcategoryLabel)).not.toBeInTheDocument()
      expect(screen.queryByText(selectedSubcategory)).not.toBeInTheDocument()
    })
  })

  describe('assign user', () => {
    it('should not show assigned user by default', async () => {
      render(renderWithContext())
      await screen.findByTestId('meta-list-date-definition')

      expect(
        screen.queryByTestId('meta-list-assigned_user_email-definition')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('meta-list-assigned_user_email-value')
      ).not.toBeInTheDocument()
    })

    it('should show assigned user with assignSignalToEmployee enabled', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      render(renderWithContext())
      await screen.findByTestId('meta-list-date-definition')

      expect(
        screen.getByTestId('meta-list-assigned_user_email-definition')
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('meta-list-assigned_user_email-value')
      ).toBeInTheDocument()
      expect(screen.getByText('Niet toegewezen')).toBeInTheDocument()
    })

    it('should not show assigned user without a selected department', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      configuration.featureFlags.assignSignalToDepartment = true
      render(renderWithContext())
      await screen.findByTestId('meta-list-date-definition')

      expect(
        screen.queryByTestId('meta-list-assigned_user_email-definition')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('meta-list-assigned_user_email-value')
      ).not.toBeInTheDocument()
    })

    it('should not show assigned user with a category with only one department without it being selected', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: departmentAscCode,
          },
        })
      )
      await screen.findByTestId('meta-list-date-definition')

      expect(
        screen.queryByTestId('meta-list-assigned_user_email-definition')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('meta-list-assigned_user_email-value')
      ).not.toBeInTheDocument()
    })

    it('should show assigned user with a selected department', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          routing_departments: {
            code: departmentAscCode,
            name: departmentAscName,
          },
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
        })
      )
      await screen.findByTestId('meta-list-date-definition')

      expect(
        screen.getByTestId('meta-list-assigned_user_email-definition')
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('meta-list-assigned_user_email-value')
      ).toBeInTheDocument()
      expect(screen.getByText('Niet toegewezen')).toBeInTheDocument()
    })

    it('should not show assigned user when users not defined', async () => {
      configuration.featureFlags.assignSignalToEmployee = true
      mockRequestHandler({
        url: API.AUTOCOMPLETE_USERNAMES,
        status: 400,
        body: 'No users defined',
      })
      render(renderWithContext(incidentFixture))
      await screen.findByTestId('meta-list-date-definition')

      expect(
        screen.queryByTestId('meta-list-assigned_user_email-definition')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('meta-list-assigned_user_email-value')
      ).not.toBeInTheDocument()
    })

    describe('username', () => {
      it('should be visible', async () => {
        configuration.featureFlags.assignSignalToEmployee = true

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: autocompleteUsernamesAscAegName,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesAscAegName)
        ).toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesThoName)
        ).not.toBeInTheDocument()
      })

      it('should be visible even if in another department', async () => {
        configuration.featureFlags.assignSignalToEmployee = true

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: autocompleteUsernamesAscAegName,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesAscAegName)
        ).toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesThoName)
        ).not.toBeInTheDocument()
      })

      it('should be visible even if no department selected', async () => {
        configuration.featureFlags.assignSignalToEmployee = true
        configuration.featureFlags.assignSignalToDepartment = true

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: autocompleteUsernamesAscName,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesAscName)
        ).toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesThoName)
        ).not.toBeInTheDocument()
      })

      it('should be visible even if not in a department', async () => {
        configuration.featureFlags.assignSignalToEmployee = true

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: autocompleteUsernamesEmptyName,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesEmptyName)
        ).toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesThoName)
        ).not.toBeInTheDocument()
      })

      it('should be visible even if the category has no departments defined', async () => {
        configuration.featureFlags.assignSignalToEmployee = true

        render(
          renderWithContext({
            ...incidentFixture,
            assigned_user_email: autocompleteUsernamesAscAegName,
            category: {
              ...incidentFixture.category,
              // TODO incidentFixture has two departments defined ("AEG, CCA")
              // departments: '',
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(screen.queryByText('Niet toegewezen')).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesEmptyName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscAegName)
        ).toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesThoName)
        ).not.toBeInTheDocument()
      })
    })

    describe('available users', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToEmployee = true
      })

      it('should be based on departments related to category', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        const editButton = screen.getByTestId('editAssigned_user_emailButton')
        userEvent.click(editButton)

        expect(
          container.querySelectorAll('select[data-testid="input"] option')
            .length
        ).toBe(4)
        expect(
          screen.getByText(autocompleteUsernamesAscName)
        ).toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesAegName)
        ).toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscAegName)
        ).toBeInTheDocument()
      })

      it('should work with only one department related to category', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: departmentThoCode,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        const editButton = screen.getByTestId('editAssigned_user_emailButton')
        userEvent.click(editButton)

        expect(
          container.querySelectorAll('select[data-testid="input"] option')
            .length
        ).toBe(2)
        expect(
          screen.queryByText(autocompleteUsernamesAscName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesThoName)
        ).toBeInTheDocument()
      })

      it('should not work without any departments related to category', async () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: undefined,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(
          screen.queryByTestId('meta-list-assigned_user_email-definition')
        ).not.toBeInTheDocument()
        expect(
          screen.queryByTestId('meta-list-assigned_user_email-value')
        ).not.toBeInTheDocument()
      })

      it('should not work without any departments defined', async () => {
        jest
          .spyOn(departmentsSelectors, 'makeSelectDepartments')
          .mockImplementation(() => ({ count: 0, list: [] }))
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(
          screen.queryByTestId('meta-list-assigned_user_email-definition')
        ).not.toBeInTheDocument()
        expect(
          screen.queryByTestId('meta-list-assigned_user_email-value')
        ).not.toBeInTheDocument()
      })

      it('should not work without a departments result set', async () => {
        jest
          .spyOn(departmentsSelectors, 'makeSelectDepartments')
          .mockImplementation(() => null)
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        expect(
          screen.queryByTestId('meta-list-assigned_user_email-definition')
        ).not.toBeInTheDocument()
        expect(
          screen.queryByTestId('meta-list-assigned_user_email-value')
        ).not.toBeInTheDocument()
      })

      it('should use departments related to by routing, if present, instead', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                code: departmentThoCode,
                name: departmentThoName,
              },
            ],
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        const editButton = screen.getByTestId('editAssigned_user_emailButton')
        userEvent.click(editButton)

        expect(
          container.querySelectorAll('select[data-testid="input"] option')
            .length
        ).toBe(2)
        expect(
          screen.queryByText(autocompleteUsernamesEmptyName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAscName)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByText(autocompleteUsernamesAegName)
        ).not.toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesThoName)
        ).toBeInTheDocument()
      })

      it('should fallback to departments related to category when no routing departments present', async () => {
        const { container } = render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        )

        await screen.findByTestId('meta-list-date-definition')

        const editButton = screen.getByTestId('editAssigned_user_emailButton')
        userEvent.click(editButton)

        expect(
          container.querySelectorAll('select[data-testid="input"] option')
            .length
        ).toBe(4)
        expect(
          screen.getByText(autocompleteUsernamesAscName)
        ).toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesAegName)
        ).toBeInTheDocument()
        expect(
          screen.getByText(autocompleteUsernamesAscAegName)
        ).toBeInTheDocument()
      })
    })
  })

  describe('assign department', () => {
    const departmentLabel = 'Afdeling'
    const notFound = 'Niet gevonden'
    const notLinked = 'Niet gekoppeld'

    it('should not show assigned department by default', () => {
      render(renderWithContext())

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument()
    })

    it('should not show assigned department without departments defined', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      jest
        .spyOn(departmentsSelectors, 'makeSelectDepartments')
        .mockImplementation(() => ({ count: 0, list: [] }))
      render(renderWithContext())

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument()
    })

    it('should not show assigned department without departments result set', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      jest
        .spyOn(departmentsSelectors, 'makeSelectDepartments')
        .mockImplementation(() => null)
      render(renderWithContext())

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument()
    })

    it('should not show assigned department if given category departments are not defined', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: 'UNDE, FINED',
          },
        })
      )

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument()
    })

    it('should not show assigned department without any category department', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: '',
          },
        })
      )

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument()
    })

    it('should not show assigned department without any category', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: null,
        })
      )

      expect(screen.queryByText(departmentLabel)).not.toBeInTheDocument()
    })

    it('should show assigned department when only one category department', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: departmentAscCode,
          },
        })
      )

      expect(screen.queryByText(departmentLabel)).toBeInTheDocument()
    })

    it('should show assigned department when more than one category department and assignSignalToDepartment enabled', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
        })
      )

      expect(screen.getByText(departmentLabel)).toBeInTheDocument()
    })

    describe('department name', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToDepartment = true
      })

      it('should be visible for one category department', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: departmentAscCode,
            },
            routing_departments: [
              {
                id: departmentAscId,
                code: departmentAscCode,
                name: departmentAscName,
              },
            ],
          })
        )

        expect(screen.queryByText(notFound)).not.toBeInTheDocument()
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument()
        expect(screen.getByText(departmentAscName)).toBeInTheDocument()
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should be visible for more than one category department and be editable', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentAscId,
                code: departmentAscCode,
                name: departmentAscName,
              },
            ],
          })
        )

        expect(screen.queryByText(notFound)).not.toBeInTheDocument()
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument()
        expect(screen.getByText(departmentAscName)).toBeInTheDocument()
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should indicate when not in category', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentThoId,
                code: departmentThoCode,
                name: departmentThoName,
              },
            ],
          })
        )

        expect(screen.getByText(departmentLabel)).toBeInTheDocument()
        expect(screen.getByText(notFound)).toBeInTheDocument()
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should indicate when not linked yet, with only one category department', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: departmentAscCode,
            },
            routing_departments: [],
          })
        )

        expect(screen.queryByText(notFound)).not.toBeInTheDocument()
        expect(screen.getByText(notLinked)).toBeInTheDocument()
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should indicate when not linked yet', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        )

        expect(screen.queryByText(notFound)).not.toBeInTheDocument()
        expect(screen.getByText(notLinked)).toBeInTheDocument()
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should indicate not linked without signal departments', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: null,
          })
        )

        expect(screen.queryByText(notFound)).not.toBeInTheDocument()
        expect(screen.getByText(notLinked)).toBeInTheDocument()
        expect(screen.queryByText(departmentAscName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentAegName)).not.toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })
    })

    describe('available departments', () => {
      beforeEach(() => {
        configuration.featureFlags.assignSignalToDepartment = true
      })

      it('should be based on departments related to category', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentAscId,
                code: departmentAscCode,
                name: departmentAscName,
              },
            ],
          })
        )

        fireEvent.click(screen.getByTestId('editRouting_departmentsButton'))

        expect(
          document.querySelectorAll('select[data-testid="input"] option').length
        ).toBe(2)
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument()
        expect(screen.getAllByText(departmentAscName).length).toBe(2)
        expect(screen.getByText(departmentAegName)).toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should have the extra option not linked if that is the case', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [],
          })
        )

        fireEvent.click(screen.getByTestId('editRouting_departmentsButton'))

        expect(
          document.querySelectorAll('select[data-testid="input"] option').length
        ).toBe(3)
        expect(screen.getAllByText(notLinked).length).toBe(2)
        expect(screen.getByText(departmentAscName)).toBeInTheDocument()
        expect(screen.getByText(departmentAegName)).toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })

      it('should not be affected if a different department selected', () => {
        render(
          renderWithContext({
            ...incidentFixture,
            category: {
              ...incidentFixture.category,
              departments: `${departmentAscCode}, ${departmentAegCode}`,
            },
            routing_departments: [
              {
                id: departmentThoId,
                code: departmentThoCode,
                name: departmentThoName,
              },
            ],
          })
        )

        fireEvent.click(screen.getByTestId('editRouting_departmentsButton'))

        expect(
          document.querySelectorAll('select[data-testid="input"] option').length
        ).toBe(2)
        expect(screen.queryByText(notLinked)).not.toBeInTheDocument()
        expect(screen.getAllByText(departmentAscName).length).toBe(2)
        expect(screen.getByText(departmentAegName)).toBeInTheDocument()
        expect(screen.queryByText(departmentThoName)).not.toBeInTheDocument()
      })
    })

    it('should update connected department', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
          routing_departments: [
            {
              id: departmentAscId,
              code: departmentAscCode,
              name: departmentAscName,
            },
          ],
        })
      )

      fireEvent.click(screen.getByTestId('editRouting_departmentsButton'))
      fireEvent.click(screen.getByTestId('submitRouting_departmentsButton'))

      expect(update).toHaveBeenCalledWith({
        patch: {
          routing_departments: [
            {
              id: departmentAscId,
            },
          ],
        },
        type: 'routing_departments',
      })
    })

    it('should update not connected department', () => {
      configuration.featureFlags.assignSignalToDepartment = true
      render(
        renderWithContext({
          ...incidentFixture,
          category: {
            ...incidentFixture.category,
            departments: `${departmentAscCode}, ${departmentAegCode}`,
          },
          routing_departments: [],
        })
      )

      fireEvent.click(screen.getByTestId('editRouting_departmentsButton'))
      fireEvent.click(screen.getByTestId('submitRouting_departmentsButton'))

      expect(update).toHaveBeenCalledWith({
        patch: {
          routing_departments: [],
        },
        type: 'routing_departments',
      })
    })
  })

  describe('update directing departmens', () => {
    it('should update for directing department to ASC', async () => {
      jest
        .spyOn(departmentsSelectors, 'makeSelectDepartments')
        .mockImplementation(() => ({ ...departments }))
      jest
        .spyOn(departmentsSelectors, 'makeSelectDirectingDepartments')
        .mockImplementation(() => directingDepartments)
      render(renderWithContext(parentIncident))

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton'
      const submitTestId = 'submitDirecting_departmentsButton'
      const editButtons = screen.getAllByTestId(editTestId)

      const { id } = departments.list.find(
        (department) => department.code === 'ASC'
      ) as any

      fireEvent.click(editButtons[0])

      fireEvent.click(screen.getByTestId('input-ASC'))

      const submitButtons = screen.getAllByTestId(submitTestId)

      expect(update).not.toHaveBeenCalled()

      fireEvent.click(submitButtons[0])

      expect(update).toHaveBeenCalledWith({
        patch: {
          directing_departments: [{ id }],
        },
        type: 'directing_departments',
      })
    })

    it('should update for directing department to directing department', async () => {
      jest
        .spyOn(departmentsSelectors, 'makeSelectDepartments')
        .mockImplementation(() => ({ ...departments }))
      jest
        .spyOn(departmentsSelectors, 'makeSelectDirectingDepartments')
        .mockImplementation(() => directingDepartments)
      render(
        renderWithContext({
          ...parentIncident,
          directing_departments: [
            { id: departments.list[0].id, code: departments.list[0].code },
          ],
        })
      )

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton'
      const submitTestId = 'submitDirecting_departmentsButton'
      const editButtons = screen.getAllByTestId(editTestId)

      fireEvent.click(editButtons[0])
      fireEvent.click(screen.getByTestId('input-null'))

      const submitButtons = screen.getAllByTestId(submitTestId)

      expect(update).not.toHaveBeenCalled()

      fireEvent.click(submitButtons[0])

      expect(update).toHaveBeenCalledWith({
        patch: {
          directing_departments: [],
        },
        type: 'directing_departments',
      })
    })

    it('should update for directing department to empty if code unknown', () => {
      jest
        .spyOn(departmentsSelectors, 'makeSelectDepartments')
        .mockImplementation(() => null)
      render(
        renderWithContext({
          ...parentIncident,
          directing_departments: [
            { id: departments.list[0].id, code: 'unknown' },
          ],
        })
      )

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton'
      const submitTestId = 'submitDirecting_departmentsButton'
      const editButtons = screen.getAllByTestId(editTestId)

      fireEvent.click(editButtons[0])

      const submitButtons = screen.getAllByTestId(submitTestId)

      expect(update).not.toHaveBeenCalled()

      fireEvent.click(submitButtons[0])

      expect(update).toHaveBeenCalledWith({
        patch: {
          directing_departments: [],
        },
        type: 'directing_departments',
      })
    })

    it('should update for directing department to empty if no departments defined', () => {
      jest
        .spyOn(departmentsSelectors, 'makeSelectDepartments')
        .mockImplementation(() => null)
      render(renderWithContext(parentIncident))

      // priority button data-testid attribute is dynamically generated in the ChangeValue component:
      const editTestId = 'editDirecting_departmentsButton'
      const submitTestId = 'submitDirecting_departmentsButton'
      const editButtons = screen.getAllByTestId(editTestId)

      fireEvent.click(editButtons[0])

      fireEvent.click(screen.getByTestId('input-ASC'))

      const submitButtons = screen.getAllByTestId(submitTestId)

      expect(update).not.toHaveBeenCalled()

      fireEvent.click(submitButtons[0])

      expect(update).toHaveBeenCalledWith({
        patch: {
          directing_departments: [],
        },
        type: 'directing_departments',
      })
    })
  })
})
