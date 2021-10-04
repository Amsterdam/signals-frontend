// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
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
import inputSelectRolesSelectorFixture from 'utils/__tests__/fixtures/inputSelectRolesSelector.json'
import inputSelectDepartmentsSelectorFixture from 'utils/__tests__/fixtures/inputSelectDepartmentsSelector.json'
import { USER_URL } from 'signals/settings/routes'
import * as constants from 'containers/App/constants'
import * as reactRouter from 'react-router-dom'
import * as appSelectors from 'containers/App/selectors'
import { setUserFilters } from 'signals/settings/actions'
import SettingsContext from 'signals/settings/context'
import * as rolesSelectors from 'models/roles/selectors'
import * as departmenstSelectors from 'models/departments/selectors'
import { initialState } from '../../../reducer'

import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'

import UsersOverview from '..'

type TestContext = {
  scrollTo: any
  push: any
  history?: any
}

fetchMock.disableMocks()

jest.mock('containers/App/constants', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/constants'),
  PAGE_SIZE: 5,
}))

jest.mock('signals/settings/actions', () => ({
  __esModule: true,
  ...jest.requireActual('signals/settings/actions'),
}))

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const state = initialState

const dispatch = jest.fn()

let testContext: TestContext
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
    // eslint-disable-next-line
    // @ts-ignore
    constants.PAGE_SIZE = 5

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: '1' }))

    jest
      .spyOn(departmenstSelectors, 'inputSelectDepartmentsSelector')
      .mockImplementation(() => inputSelectDepartmentsSelectorFixture)

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
  })

  afterAll(() => {
    jest.restoreAllMocks()
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
    mockRequestHandler({ body: {} })
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
      within(screen.getByTestId('pagination')).queryByText('2')
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('pagination')).getByText('2').nodeName
    ).toEqual('BUTTON')

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: '2' }))

    unmount()

    rerender(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(
      within(screen.getByTestId('pagination')).getByText('2').nodeName
    ).not.toEqual('BUTTON')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constants.PAGE_SIZE = usersJSON.count

    unmount()

    rerender(usersOverviewWithAppContext({ pageSize: constants.PAGE_SIZE }))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('should push to the history stack and scroll to top on pagination item click', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constants.PAGE_SIZE = 5

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

    const row = container.querySelector(
      'tbody tr:nth-child(3)'
    ) as HTMLTableRowElement

    const username = row.querySelector(
      'td:first-of-type'
    ) as HTMLTableCellElement

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = `${itemId}`

    expect(push).toHaveBeenCalledTimes(0)

    userEvent.click(username)

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith(`${USER_URL}/${itemId}`)

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId

    userEvent.click(username)

    expect(push).toHaveBeenCalledTimes(1)

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = `${itemId}`

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

    const row = container.querySelector(
      'tbody tr:nth-child(2)'
    ) as HTMLTableRowElement

    // Explicitly set an 'itemId'.
    row.dataset.itemId = '666'

    userEvent.click(
      row.querySelector('td:first-of-type') as HTMLTableCellElement
    )

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
    jest.useFakeTimers()

    const filterByUserName = screen.getByTestId('filterUsersByUsername')
    const filterByUserNameInput = filterByUserName.querySelector(
      'input'
    ) as HTMLInputElement
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
    jest.useRealTimers()
  })

  it('should remove reset the filter when the search box is cleared ', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    jest.useFakeTimers()

    const filterByUserNameInput = within(
      screen.getByTestId('filterUsersByUsername')
    ).getByRole('textbox')
    const filterValue = 'test1'

    userEvent.type(filterByUserNameInput, filterValue)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ username: filterValue })
    )

    const clearButton = within(
      screen.getByTestId('filterUsersByUsername')
    ).getByRole('button')
    userEvent.click(clearButton)

    await screen.findByTestId('filterUsersByUsername')
    expect(dispatch).toHaveBeenCalledTimes(2)
    expect(dispatch).toHaveBeenLastCalledWith(setUserFilters({ username: '' }))
    jest.useRealTimers()
  })

  it('should not dispatch filter values when input value has not changed', async () => {
    const username = 'foo bar baz'
    const stateCfg = {
      users: { filters: { ...state.users.filters, username } },
    }

    const { rerender, unmount } = render(usersOverviewWithAppContext())

    expect(dispatch).not.toHaveBeenCalled()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    jest.useFakeTimers()

    const filterByUserNameInput = within(
      screen.getByTestId('filterUsersByUsername')
    ).getByRole('textbox')

    userEvent.type(filterByUserNameInput, username)

    await screen.findByTestId('filterUsersByUsername')

    act(() => {
      jest.advanceTimersByTime(250)
    })

    jest.useRealTimers()

    expect(dispatch).toHaveBeenCalledTimes(1)

    unmount()

    rerender(usersOverviewWithAppContext({}, {}, stateCfg))
    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    jest.useFakeTimers()

    userEvent.type(filterByUserNameInput, username)

    await screen.findByTestId('filterUsersByUsername')

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)

    await screen.findByTestId('filterUsersByUsername')

    jest.useRealTimers()
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
      .mockImplementation(() => inputSelectRolesSelectorFixture)

    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByRoleSelect = screen.getByTestId(
      'roleSelect'
    ) as HTMLSelectElement

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
    ) as HTMLOptionElement

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

    const filterByUserActiveSelect = screen.getByTestId(
      'userActiveSelect'
    ) as HTMLSelectElement

    // check if the default value has been set
    expect(filterByUserActiveSelect.value).toBe('*')

    await screen.findByTestId('userActiveSelect')

    const filterValue = 'true'

    userEvent.selectOptions(filterByUserActiveSelect, filterValue)

    await screen.findByTestId('userActiveSelect')

    expect(filterByUserActiveSelect.value).toBe(filterValue)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith(
      setUserFilters({ is_active: filterValue })
    )
  })

  it('should keep the state of all filters in context', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByUserActiveSelect = screen.getByTestId(
      'userActiveSelect'
    ) as HTMLSelectElement
    const filterByRoleSelect = screen.getByTestId(
      'roleSelect'
    ) as HTMLSelectElement

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

    expect(filterByUserActiveSelect.value).toEqual(userActiveFilterValue)
    expect(filterByRoleSelect.value).toEqual(roleFilterValue)
  })

  it('should check if default filter values have been set', async () => {
    render(usersOverviewWithAppContext())

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByRoleSelect = screen.getByTestId(
      'roleSelect'
    ) as HTMLSelectElement
    const filterByUserActiveSelect = (await screen.findByTestId(
      'userActiveSelect'
    )) as HTMLSelectElement

    expect(filterByRoleSelect.value).toBe('*')
    expect(filterByUserActiveSelect.value).toBe('*')
  })

  it('should select "Behandelaar" as filter and dispatch a fetch action', async () => {
    const mockedState = {
      users: { filters: { ...state.users.filters, role: 'Behandelaar' } },
    }
    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const filterByRoleSelect = screen.getByTestId(
      'roleSelect'
    ) as HTMLSelectElement

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByRoleSelect, 'Behandelaar')

    await screen.findByTestId('roleSelect')

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(filterByRoleSelect.value).toBe('Behandelaar')
  })

  it('should select "Actief" as filter and dispatch a fetch action', async () => {
    const mockedState = {
      users: { filters: { ...state.users.filters, is_active: 'true' } },
    }
    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const filterByUserActiveSelect = screen.getByTestId(
      'userActiveSelect'
    ) as HTMLSelectElement

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByUserActiveSelect, 'true')

    await screen.findByTestId('userActiveSelect')

    expect(dispatch).toHaveBeenCalledTimes(1)

    expect(filterByUserActiveSelect.value).toBe('true')
  })

  it('should select a value in the select filters and dispatch a fetch action', async () => {
    const mockedState = {
      users: {
        filters: {
          ...state.users.filters,
          is_active: 'true',
          role: 'Behandelaar',
        },
      },
    }

    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )
    const filterByRoleSelect = screen.getByTestId(
      'roleSelect'
    ) as HTMLSelectElement
    const filterByUserActiveSelect = (await screen.findByTestId(
      'userActiveSelect'
    )) as HTMLSelectElement

    expect(dispatch).toHaveBeenCalledTimes(0)

    userEvent.selectOptions(filterByUserActiveSelect, 'true')
    userEvent.selectOptions(filterByRoleSelect, 'Behandelaar')

    expect(dispatch).toHaveBeenCalledTimes(2)

    expect(filterByRoleSelect.value).toBe('Behandelaar')
    expect(filterByUserActiveSelect.value).toBe('true')
  })

  it('should select department in the select filters and dispatch a fetch action', async () => {
    const activeDepartment = inputSelectDepartmentsSelectorFixture[4]
    const mockedState = {
      users: {
        filters: {
          ...state.users.filters,
          profile_department_code: activeDepartment.key,
        },
      },
    }

    render(usersOverviewWithAppContext({}, {}, mockedState))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loadingIndicator')
    )

    const filterByRoleSelect = screen.getByTestId(
      'roleSelect'
    ) as HTMLSelectElement
    const filterByDepartmentSelect = (await screen.findByTestId(
      'departmentSelect'
    )) as HTMLSelectElement

    expect(filterByDepartmentSelect.value).toBe(activeDepartment.key)

    expect(dispatch).toHaveBeenCalledTimes(0)

    const otherDepartment = inputSelectDepartmentsSelectorFixture[6]

    userEvent.selectOptions(filterByRoleSelect, 'Behandelaar')
    userEvent.selectOptions(
      filterByDepartmentSelect,
      otherDepartment.key.toString()
    )

    expect(dispatch).toHaveBeenLastCalledWith(
      setUserFilters({
        profile_department_code: otherDepartment.key.toString(),
      })
    )
  })
})
