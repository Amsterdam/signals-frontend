// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React from 'react'
import {
  render,
  within,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { history as memoryHistory, withCustomAppContext } from 'test/utils'

import usersJSON from 'utils/__tests__/fixtures/users.json'
import inputSelectRolesSelectorJSON from 'utils/__tests__/fixtures/inputSelectRolesSelector.json'
import { USER_URL } from 'signals/settings/routes'
import configuration from 'shared/services/configuration/configuration'
import * as constants from 'containers/App/constants'
import * as reactRouter from 'react-router-dom'
import * as appSelectors from 'containers/App/selectors'
import { setUserFilters } from 'signals/settings/actions'
import SettingsContext from 'signals/settings/context'
import * as rolesSelectors from 'models/roles/selectors'

import {
  fetchMock,
  mockGet,
} from '../../../../../../internals/testing/msw-server'

import UsersOverview from '..'
fetchMock.disableMocks()

jest.mock('containers/App/constants', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/constants'),
}))

jest.mock('signals/settings/actions', () => ({
  __esModule: true,
  ...jest.requireActual('signals/settings/actions'),
}))

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const state = {
  users: {
    filters: {},
  },
}

const dispatch = jest.fn()

let testContext = {}
const usersOverviewWithAppContext = (
  overrideProps = {},
  overrideCfg = {},
  stateCfg = state
) => {
  const { history } = testContext
  const props = {
    ...overrideProps,
  }

  return withCustomAppContext(
    <SettingsContext.Provider value={{ state: stateCfg, dispatch }}>
      <UsersOverview {...props} />
    </SettingsContext.Provider>
  )({
    routerCfg: { history },
    ...overrideCfg,
  })
}

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    constants.PAGE_SIZE = 5
    jest.useFakeTimers()

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: 1 }))

    const push = jest.fn()
    const scrollTo = jest.fn()

    const history = { ...memoryHistory, push }

    global.window.scrollTo = scrollTo

    testContext = {
      history,
      push,
      scrollTo,
    }
  })

  afterEach(() => {
    dispatch.mockReset()

    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render "add user" button', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)

    const { rerender, unmount } = render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryByText('Gebruiker toevoegen')).toBeInTheDocument()

    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => false)

    unmount()

    rerender(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryByText('Gebruiker toevoegen')).not.toBeInTheDocument()
  })

  it('should request users from API on mount', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(
      screen.getByText(`Gebruikers (${usersJSON.count})`)
    ).toBeInTheDocument()
    expect(screen.queryByTestId('dataViewHeadersRow')).toBeInTheDocument()
    expect(screen.queryAllByTestId('dataViewBodyRow')).toHaveLength(
      constants.PAGE_SIZE
    )
  })

  it('should render title, data view with headers only and loading indicator when loading', async () => {
    render(usersOverviewWithAppContext())

    expect(screen.getByText('Gebruikers')).toBeInTheDocument()
    expect(screen.queryByTestId('dataViewHeadersRow')).toBeInTheDocument()
    expect(screen.queryByTestId('loadingIndicator')).toBeInTheDocument()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(
      screen.getByText(`Gebruikers (${usersJSON.count})`)
    ).toBeInTheDocument()
    expect(screen.queryByTestId('dataViewHeadersRow')).toBeInTheDocument()
    expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
  })

  it('should render title and data view with headers only when no data', async () => {
    mockGet(200, {})
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.getByText('Gebruikers')).toBeInTheDocument()
    expect(screen.getByTestId('dataViewHeadersRow')).toBeInTheDocument()
    expect(screen.queryAllByTestId('dataViewBodyRow')).toHaveLength(0)
  })

  it('should render data view with no data when loading', async () => {
    render(usersOverviewWithAppContext())

    expect(screen.queryAllByTestId('dataViewBodyRow')).toHaveLength(0)

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryAllByTestId('dataViewBodyRow')).toHaveLength(
      constants.PAGE_SIZE
    )
  })

  it('should data view when data', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryAllByTestId('dataViewBodyRow')).toHaveLength(
      constants.PAGE_SIZE
    )
  })

  it('should render pagination controls', async () => {
    const { rerender, unmount } = render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryByTestId('pagination')).toBeInTheDocument()
    expect(
      within(screen.queryByTestId('pagination')).queryByText('2')
    ).toBeInTheDocument()

    expect(
      within(screen.queryByTestId('pagination')).queryByText('2').nodeName
    ).toEqual('BUTTON')

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: 2 }))

    unmount()

    rerender(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(
      within(screen.queryByTestId('pagination')).queryByText('2').nodeName
    ).not.toEqual('BUTTON')

    constants.PAGE_SIZE = usersJSON.count

    unmount()

    rerender(usersOverviewWithAppContext({ pageSize: constants.PAGE_SIZE }))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('should push to the history stack and scroll to top on pagination item click', async () => {
    const { push, scrollTo } = testContext
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const page2 = await screen.findByText('2')

    userEvent.click(page2)

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    expect(push).toHaveBeenCalled()
  })

  it('should push on list item with an itemId click', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)
    const { push } = testContext
    const { container } = render(usersOverviewWithAppContext())
    const itemId = 666

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const row = container.querySelector('tbody tr:nth-child(3)')

    const username = row.querySelector('td:first-of-type')

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = itemId

    expect(push).toHaveBeenCalledTimes(0)

    userEvent.click(username)

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith(`${USER_URL}/${itemId}`)

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId

    userEvent.click(username)

    expect(push).toHaveBeenCalledTimes(1)

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = itemId

    userEvent.click(username)

    expect(push).toHaveBeenCalledTimes(2)
  })

  it('should not push on list item click when permissions are insufficient', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => false)

    const { push } = testContext
    const { container } = render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const row = container.querySelector('tbody tr:nth-child(2)')

    // Explicitly set an 'itemId'.
    row.dataset.itemId = 666

    userEvent.click(row.querySelector('td:first-of-type'))

    await screen.findByTestId('usersOverview')

    expect(push).not.toHaveBeenCalled()
  })

  it('should render a username filter', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    expect(screen.getByTestId('filterUsersByUsername')).toBeInTheDocument()
  })

  it('should dispatch filter values only after 250ms since last input change', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByUserName = screen.getByTestId('filterUsersByUsername')
    const filterByUserNameInput = filterByUserName.querySelector('input')
    const filterValue = 'test1'

    userEvent.type(filterByUserNameInput, filterValue)

    act(() => {
      jest.advanceTimersByTime(50)
    })

    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ username: filterValue })
    )

    await screen.findByTestId('filterUsersByUsername')
  })

  it('should remove reset the filter when the search box is cleared ', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByUserName = screen.getByTestId('filterUsersByUsername')
    const filterByUserNameInput = filterByUserName.querySelector('input')
    const filterValue = 'test1'

    userEvent.type(filterByUserNameInput, filterValue)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ username: filterValue })
    )

    const clearButton = filterByUserName.querySelector(
      'button[aria-label="Close"]'
    )
    userEvent.click(clearButton)

    await screen.findByTestId('filterUsersByUsername')
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenLastCalledWith(setUserFilters({ username: '' }))
  })

  it('should not dispatch filter values when input value has not changed', async () => {
    const username = 'foo bar baz'
    const stateCfg = { users: { filters: { username } } }

    const { rerender, unmount } = render(usersOverviewWithAppContext())

    expect(dispatch).not.toHaveBeenCalled()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByUserName = screen.getByTestId('filterUsersByUsername')
    const filterByUserNameInput = filterByUserName.querySelector('input')

    userEvent.type(filterByUserNameInput, username)

    await screen.findByTestId('filterUsersByUsername')

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()

    rerender(usersOverviewWithAppContext({}, {}, stateCfg))
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    userEvent.type(filterByUserNameInput, username)

    await screen.findByTestId('filterUsersByUsername')

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)

    await screen.findByTestId('filterUsersByUsername')
  })

  it('should render a role filter', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    expect(screen.getByTestId('roleSelect')).toBeInTheDocument()
  })

  it('should select the right option when role filter changes', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)

    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorJSON)

    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByRoleSelect = screen.getByTestId('roleSelect')

    // check if the default value has been set
    expect(filterByRoleSelect.value).toBe('*')

    const filterValue = 'Regievoerder'

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByRoleSelect, filterValue)

    await screen.findByTestId('roleSelect')

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(setUserFilters({ role: filterValue }))

    expect(filterByRoleSelect.value).toBe(filterValue)

    const activeOption = filterByRoleSelect.querySelector(
      'select option:nth-child(8)'
    )

    expect(activeOption.value).toBe(filterValue)
  })

  it('should render a user active (status) filter', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    expect(screen.getByTestId('userActiveSelect')).toBeInTheDocument()
  })

  it('should select the right option when user active (status) filter changes', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByUserActiveSelect = screen.getByTestId('userActiveSelect')

    // check if the default value has been set
    expect(filterByUserActiveSelect.value).toBe('*')

    const filterValue = 'true'

    userEvent.selectOptions(filterByUserActiveSelect, filterValue)

    await screen.findByTestId('userActiveSelect')

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ is_active: filterValue })
    )

    expect(filterByUserActiveSelect.value).toBe(filterValue)
  })

  it('should keep the state of all filters in context', async () => {
    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorJSON)
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByUserActiveSelect = screen.getByTestId('userActiveSelect')
    const filterByRoleSelect = screen.getByTestId('roleSelect')

    // check if the default values have been set
    expect(filterByUserActiveSelect.value).toBe('*')
    expect(filterByRoleSelect.value).toBe('*')

    const userActiveFilterValue = 'true'
    const roleFilterValue = 'Regievoerder'

    userEvent.selectOptions(filterByUserActiveSelect, userActiveFilterValue)
    userEvent.selectOptions(filterByRoleSelect, roleFilterValue)

    await screen.findByTestId('userActiveSelect')

    expect(dispatch).toHaveBeenCalledTimes(2)

    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ is_active: userActiveFilterValue })
    )
    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ role: roleFilterValue })
    )

    expect(filterByUserActiveSelect.value).toBe(userActiveFilterValue)
    expect(filterByRoleSelect.value).toBe(roleFilterValue)
  })

  it('should check if default filter values have been set', async () => {
    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorJSON)

    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByRoleSelect = screen.getByTestId('roleSelect')
    const filterByUserActiveSelect = await screen.findByTestId(
      'userActiveSelect'
    )

    expect(filterByRoleSelect.value).toBe('*')
    expect(filterByUserActiveSelect.value).toBe('*')
  })

  it('should select "Behandelaar" as filter and dispatch a fetch action', async () => {
    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorJSON)

    const mockedState = { users: { filters: { role: 'Behandelaar' } } }
    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const filterByRoleSelect = screen.getByTestId('roleSelect')

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByRoleSelect, 'Behandelaar')

    await screen.findByTestId('roleSelect')

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(filterByRoleSelect.value).toBe('Behandelaar')
  })

  it('should select "Actief" as filter and dispatch a fetch action', async () => {
    const mockedState = { users: { filters: { is_active: true } } }
    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const filterByUserActiveSelect = screen.getByTestId('userActiveSelect')

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByUserActiveSelect, 'true')

    await screen.findByTestId('userActiveSelect')

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(filterByUserActiveSelect.value).toBe('true')
  })

  it('should select a value in the select filters and dispatch a fetch action', async () => {
    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorJSON)

    const mockedState = {
      users: { filters: { is_active: true, role: 'Behandelaar' } },
    }

    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const filterByRoleSelect = screen.getByTestId('roleSelect')
    const filterByUserActiveSelect = await screen.findByTestId(
      'userActiveSelect'
    )

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByUserActiveSelect, 'true')
    userEvent.selectOptions(filterByRoleSelect, 'Behandelaar')

    expect(dispatch).toHaveBeenCalledTimes(2)

    expect(filterByRoleSelect.value).toBe('Behandelaar')
    expect(filterByUserActiveSelect.value).toBe('true')
  })
})
