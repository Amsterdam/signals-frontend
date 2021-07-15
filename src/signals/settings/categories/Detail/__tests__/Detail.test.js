// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, act, screen, waitFor } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'
import * as reactRedux from 'react-redux'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'
import routes from 'signals/settings/routes'
import historyJSON from 'utils/__tests__/fixtures/history.json'
import configuration from 'shared/services/configuration/configuration'
import { fetchCategories } from 'models/categories/actions'
import { showGlobalNotification } from 'containers/App/actions'
import * as appSelectors from 'containers/App/selectors'

import { subCategories } from 'utils/__tests__/fixtures'
import useConfirmedCancel from '../../../hooks/useConfirmedCancel'
import CategoryDetailContainer from '..'

const categoryJSON = subCategories.find((sub) => sub?._links['sia:parent'])

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
}))

jest.mock('models/categories/actions', () => ({
  __esModule: true,
  ...jest.requireActual('models/categories/actions'),
}))

jest.mock('../../../hooks/useConfirmedCancel')

const userCan = jest.fn(() => () => true)
jest.spyOn(appSelectors, 'makeSelectUserCan').mockImplementation(userCan)

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

const push = jest.fn()
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}))

const confirmedCancel = jest.fn()
useConfirmedCancel.mockImplementation(() => confirmedCancel)

describe.skip('signals/settings/categories/Detail', () => {
  beforeEach(() => {
    fetch.once(JSON.stringify(categoryJSON)).once(JSON.stringify(historyJSON))

    dispatch.mockReset()
    push.mockReset()
    confirmedCancel.mockReset()
  })

  afterEach(() => {
    fetch.mockClear()
  })

  it('should render a backlink', async () => {
    render(withAppContext(<CategoryDetailContainer />))

    const backLink = await screen.findByTestId('backlink')

    expect(backLink.getAttribute('href')).toEqual(routes.categories)
  })

  it('should render a backlink with the proper referrer', async () => {
    const referrer = '/some-page-we-came-from'

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      referrer,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    const backLink = await screen.findByTestId('backlink')

    expect(backLink.getAttribute('href')).toEqual(referrer)
  })

  it('should render the correct page title for a new category', async () => {
    render(withAppContext(<CategoryDetailContainer />))

    const title = await screen.findByText('Subcategorie toevoegen')
    expect(title).toBeInTheDocument()
  })

  it('should render the correct page title for an existing category', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: categoryJSON.id,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    const title = await screen.findByText('Subcategorie wijzigen')
    expect(title).toBeInTheDocument()
  })

  it('should render a form for a new category', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: undefined,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    const form = screen.getByTestId('detailCategoryForm')
    expect(form).toBeInTheDocument()

    screen.getAllByRole('textbox').forEach((element) => {
      expect(element.value).toEqual('')
    })
  })

  it('should render a form for an existing category', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: 123,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')

    expect(document.querySelector('#name').value).toEqual(categoryJSON.name)
    expect(document.querySelector('#description').value).toEqual(
      categoryJSON.description
    )
  })

  it('should call confirmedCancel', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: 456,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')

    const nameField = screen.getByRole('textbox', { name: 'Naam' })
    const cancelButton = screen.getByTestId('cancelBtn')

    act(() => {
      // no changes to data in form fields
      userEvent.click(cancelButton)
    })

    expect(confirmedCancel).toHaveBeenCalledTimes(1)
    expect(confirmedCancel).toHaveBeenCalledWith(true)

    act(() => {
      // changes made, but data remains the same
      userEvent.clear(nameField)
      userEvent.type(nameField, categoryJSON.name)
    })

    act(() => {
      userEvent.click(cancelButton)
    })

    expect(confirmedCancel).toHaveBeenCalledTimes(2)
    expect(confirmedCancel).toHaveBeenLastCalledWith(true)

    act(() => {
      // changes made, data differs from initial API data
      userEvent.type(nameField, 'Some other value')
    })

    act(() => {
      userEvent.click(cancelButton)
    })

    expect(confirmedCancel).toHaveBeenCalledTimes(3)
    expect(confirmedCancel).toHaveBeenLastCalledWith(false)
  })

  it.skip('should not update NULL values with empty string', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: 10101,
    }))
    const categoryData = {
      ...categoryJSON,
      description: null,
    }
    fetch.resetMocks()
    fetch.mockResponses(
      [JSON.stringify(categoryData), { status: 200 }],
      [JSON.stringify(historyJSON), { status: 200 }],
      [JSON.stringify(categoryData), { status: 200 }]
    )

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')

    userEvent.click(screen.getByTestId('submitBtn'))

    const actualRequestBody = JSON.parse(
      fetch.mock.calls[fetch.mock.calls.length - 1][1].body
    )
    expect(actualRequestBody).toEqual(
      expect.objectContaining({ description: null })
    )

    await waitFor(() => {
      expect(screen.getByTestId('loadingIndicator')).toBeInTheDocument()
    })
  })

  it('should call confirmedCancel when data has NULL values', async () => {
    const dataWithNullValue = { ...categoryJSON, description: null }

    fetch.resetMocks()

    fetch.mockResponses(
      [JSON.stringify(dataWithNullValue), { status: 200 }],
      [JSON.stringify(historyJSON), { status: 200 }]
    )

    const categoryId = 10101
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')

    const descriptionField = screen.getByRole('textbox', {
      name: 'Omschrijving',
    })
    const cancelButton = screen.getByTestId('cancelBtn')

    act(() => {
      // no changes to data in form fields
      userEvent.click(cancelButton)
    })

    expect(confirmedCancel).toHaveBeenCalledTimes(1)
    expect(confirmedCancel).toHaveBeenCalledWith(true)

    act(() => {
      // changes made, but data remains the same
      userEvent.clear(descriptionField)
    })

    await screen.findByTestId('detailCategoryForm')

    act(() => {
      userEvent.click(cancelButton)
    })

    expect(confirmedCancel).toHaveBeenCalledTimes(2)
    expect(confirmedCancel).toHaveBeenLastCalledWith(true)

    act(() => {
      // changes made, data differs from initial API data
      userEvent.type(descriptionField, 'Here be a description')
    })

    await screen.findByTestId('detailCategoryForm')

    act(() => {
      userEvent.click(cancelButton)
    })

    expect(confirmedCancel).toHaveBeenCalledTimes(3)
    expect(confirmedCancel).toHaveBeenLastCalledWith(false)
  })

  it('should call patch on submit', async () => {
    fetch.resetMocks()

    fetch
      .once(JSON.stringify(categoryJSON)) // GET response (category)
      .once(JSON.stringify(historyJSON)) // GET response (history)
      .once(JSON.stringify(categoryJSON)) // PATCH response (category)

    const categoryId = 789
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')

    expect(fetch).toHaveBeenCalledTimes(2)

    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.click(submitBtn)
    })

    expect(dispatch).not.toHaveBeenCalled()

    expect(fetch).toHaveBeenCalledTimes(3)
    expect(fetch).toHaveBeenLastCalledWith(
      `${configuration.CATEGORIES_PRIVATE_ENDPOINT}${categoryId}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    // on patch success, re-request all categories
    await screen.findByTestId('detailCategoryForm')

    expect(dispatch).toHaveBeenCalledWith(fetchCategories())
  })

  it('should redirect on patch success', async () => {
    fetch.resetMocks()

    fetch
      .once(JSON.stringify(categoryJSON)) // GET response (category)
      .once(JSON.stringify(historyJSON)) // GET response (history)
      .once(JSON.stringify(categoryJSON)) // PATCH response (category)

    const categoryId = 789
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')
    expect(screen.getByTestId('detailCategoryForm')).toBeInTheDocument()

    const submitBtn = screen.getByTestId('submitBtn')

    act(() => {
      userEvent.click(submitBtn)
    })

    expect(dispatch).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()

    await screen.findByTestId('detailCategoryForm')

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification(expect.any(Object))
    )

    expect(push).toHaveBeenCalledTimes(1)
  })

  it('does not request history when category is not passed', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: undefined,
    }))

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByText('Terug naar overzicht')

    expect(fetch).not.toHaveBeenLastCalledWith(
      expect.stringContaining('/history'),
      expect.any(Object)
    )
  })

  it('requests history for existing category', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      categoryId: 900,
    }))

    fetch.resetMocks()

    fetch
      .once(JSON.stringify(categoryJSON)) // GET response (category)
      .once(JSON.stringify(historyJSON)) // GET response (history)

    render(withAppContext(<CategoryDetailContainer />))

    await screen.findByTestId('detailCategoryForm')

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining('/history'),
      expect.any(Object)
    )
  })
})
