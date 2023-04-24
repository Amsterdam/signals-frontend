// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import {
  render,
  within,
  act,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouter from 'react-router-dom'

import * as constants from 'containers/App/constants'
import * as appSelectors from 'containers/App/selectors'
import * as departmenstSelectors from 'models/departments/selectors'
import * as rolesSelectors from 'models/roles/selectors'
import { USER_URL, USERS_PAGED_URL } from 'signals/settings/routes'
import { history as memoryHistory, withAppContext } from 'test/utils'
import inputSelectDepartmentsSelectorFixture from 'utils/__tests__/fixtures/inputSelectDepartmentsSelector.json'
import inputSelectRolesSelectorFixture from 'utils/__tests__/fixtures/inputSelectRolesSelector.json'
import usersJSON from 'utils/__tests__/fixtures/users.json'

import UsersOverview from '..'
import * as API from '../../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'

fetchMock.disableMocks()

jest.mock('containers/App/constants', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/constants'),
  PAGE_SIZE: 5,
}))

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('models/roles/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/roles/selectors'),
}))

const scrollTo = jest.fn()
const push = jest.fn()
const unregister = jest.fn()
const listen = jest.fn(() => unregister)

global.window.scrollTo = scrollTo

const navigateSpy = jest.spyOn(reactRouter, 'useNavigation')

describe('signals/settings/users/containers/Overview', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    // @ts-ignore
    constants.PAGE_SIZE = 5

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: '1' }))

    navigateSpy.mockImplementation(() => ({ push, listen } as any))

    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorFixture)

    jest
      .spyOn(departmenstSelectors, 'inputSelectDepartmentsSelector')
      .mockImplementation(() => inputSelectDepartmentsSelectorFixture)
  })

  afterEach(() => {
    scrollTo.mockReset()
    push.mockReset()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('registers history listener on mount', () => {
    expect(listen).not.toHaveBeenCalled()

    const { unmount } = render(withAppContext(<UsersOverview />))

    expect(listen).toHaveBeenCalledTimes(1)

    // unregister on unmount
    expect(unregister).not.toHaveBeenCalled()

    unmount()

    expect(unregister).toHaveBeenCalled()
  })

  it('should render "add user" button', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)

    const { rerender, unmount } = render(withAppContext(<UsersOverview />))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await waitForElementToBeRemoved(screen.queryByTestId('loading-indicator'))

    expect(screen.queryByText('Gebruiker toevoegen')).toBeInTheDocument()

    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => false)

    unmount()

    rerender(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(screen.queryByText('Gebruiker toevoegen')).not.toBeInTheDocument()
  })

  it('renders correctly when the page URL changes', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)

    act(() => {
      memoryHistory.push(`${USERS_PAGED_URL}/1`)
    })

    const { rerender } = render(withAppContext(<UsersOverview />))

    const firstCellContents = screen
      .getByRole('table')
      .querySelector('td:first-of-type')?.textContent

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: '2' }))

    rerender(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(firstCellContents).not.toEqual(
      screen.getByRole('table').querySelector('td:first-of-type')?.textContent
    )
  })

  it('should request users from API on mount', async () => {
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(
      screen.getByText(`Gebruikers (${usersJSON.count})`)
    ).toBeInTheDocument()
    expect(screen.queryByTestId('data-view-headers-row')).toBeInTheDocument()
    expect(screen.queryAllByTestId('data-view-body-row')).toHaveLength(
      constants.PAGE_SIZE
    )
  })

  it('should render title, data view with headers only and loading indicator when loading', async () => {
    render(withAppContext(<UsersOverview />))

    expect(screen.getByText('Gebruikers')).toBeInTheDocument()
    expect(screen.queryByTestId('data-view-headers-row')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-indicator')).toBeInTheDocument()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(
      screen.getByText(`Gebruikers (${usersJSON.count})`)
    ).toBeInTheDocument()
    expect(screen.queryByTestId('data-view-headers-row')).toBeInTheDocument()
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
  })

  it('should render title and data view with headers only when no data', async () => {
    mockRequestHandler({ url: API.USERS, body: {} })
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(screen.getByText('Gebruikers')).toBeInTheDocument()
    expect(screen.getByTestId('data-view-headers-row')).toBeInTheDocument()
    expect(screen.queryAllByTestId('data-view-body-row')).toHaveLength(0)
  })

  it('should render data view with no data when loading', async () => {
    render(withAppContext(<UsersOverview />))

    expect(screen.queryAllByTestId('data-view-body-row')).toHaveLength(0)

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(screen.queryAllByTestId('data-view-body-row')).toHaveLength(
      constants.PAGE_SIZE
    )
  })

  it('should display data view when there is data available', async () => {
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(screen.queryAllByTestId('data-view-body-row')).toHaveLength(
      constants.PAGE_SIZE
    )
  })

  it('should render pagination controls', async () => {
    const { rerender, unmount } = render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(screen.queryByTestId('pagination')).toBeInTheDocument()
    expect(
      within(screen.getByTestId('pagination')).queryByTestId('nextbutton')
    ).toBeInTheDocument()

    expect(
      within(screen.getByTestId('pagination')).getByTestId('nextbutton')
        .nodeName
    ).toEqual('BUTTON')

    jest
      .spyOn(reactRouter, 'useParams')
      .mockImplementation(() => ({ pageNum: '2' }))

    unmount()

    rerender(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constants.PAGE_SIZE = usersJSON.count

    unmount()

    rerender(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('should scroll to top on pagination item click', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    constants.PAGE_SIZE = 5

    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )
    const page2 = await screen.findByTestId('nextbutton')

    expect(scrollTo).not.toHaveBeenCalled()

    userEvent.click(page2)

    await screen.findByTestId('nextbutton')

    expect(scrollTo).toHaveBeenCalledTimes(1)
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('should push on list item click', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)
    const { container } = render(withAppContext(<UsersOverview />))
    const itemId = 666

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    const row = container.querySelector(
      'tbody tr:nth-child(3)'
    ) as HTMLTableRowElement

    const username = row.querySelector(
      'td:first-of-type'
    ) as HTMLTableCellElement

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = `${itemId}`

    userEvent.click(username)

    expect(push).toHaveBeenLastCalledWith(`${USER_URL}/${itemId}`)

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

    const { container } = render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
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
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )
    expect(screen.getByTestId('filterUsersByUsername')).toBeInTheDocument()
  })

  it('should apply filter values only after 250ms since last input change', async () => {
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
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

    expect(push).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`)
    )

    await screen.findByTestId('filterUsersByUsername')
    jest.useRealTimers()
  })

  it('should reset the filter when the search box is cleared ', async () => {
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    jest.useFakeTimers()

    const filterByUserNameInput = within(
      screen.getByTestId('filterUsersByUsername')
    ).getByRole('textbox')
    const filterValue = 'test123'

    userEvent.type(filterByUserNameInput, filterValue)

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`username=${filterValue}`)
    )

    const clearButton = within(
      screen.getByTestId('filterUsersByUsername')
    ).getByRole('button')
    userEvent.click(clearButton)

    await screen.findByTestId('filterUsersByUsername')

    expect(push).toHaveBeenCalledTimes(2)
    expect(push).toHaveBeenCalledWith(expect.stringContaining('username='))

    jest.useRealTimers()
  })

  it('should not change filter values when input value has not changed', async () => {
    const username = 'foo bar baz'

    render(withAppContext(<UsersOverview />))

    expect(push).not.toHaveBeenCalled()

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
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

    expect(push).toHaveBeenCalledTimes(1)

    userEvent.type(
      filterByUserNameInput,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}'
    )

    userEvent.type(filterByUserNameInput, username)

    await screen.findByTestId('filterUsersByUsername')

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(push).toHaveBeenCalledTimes(1)

    await screen.findByTestId('filterUsersByUsername')

    jest.useRealTimers()
  })

  it('should render a role filter', async () => {
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )
    expect(screen.getByTestId('role')).toBeInTheDocument()
  })

  it('renders when roles are not available from the state yet', async () => {
    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementationOnce(() => [{ key: 'all', name: 'Alles', value: '*' }])
      .mockImplementation(() => inputSelectRolesSelectorFixture)

    memoryHistory.push(`${USERS_PAGED_URL}/1`)

    const { rerender } = render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    const filterByRoleSelect = screen.getByTestId('role') as HTMLSelectElement

    expect(
      (
        filterByRoleSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('*')

    memoryHistory.push(`${USERS_PAGED_URL}/1?role=Does not exist`)

    rerender(withAppContext(<UsersOverview />))

    await screen.findByTestId('role')

    expect(
      (
        filterByRoleSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('*')
  })

  it('renders when departments are not available from the state yet', async () => {
    jest
      .spyOn(departmenstSelectors, 'inputSelectDepartmentsSelector')
      .mockImplementationOnce(() => [{ key: '', name: 'Alles', value: '*' }])
      .mockImplementation(() => inputSelectDepartmentsSelectorFixture)

    memoryHistory.push(`${USERS_PAGED_URL}/1`)

    const { rerender } = render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    const filterByDepartmentSelect = screen.getByTestId(
      'profile_department_code'
    ) as HTMLSelectElement

    expect(
      (
        filterByDepartmentSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('*')

    memoryHistory.push(`${USERS_PAGED_URL}/1?profile_department_code=666`)

    rerender(withAppContext(<UsersOverview />))

    await screen.findByTestId('profile_department_code')

    expect(
      (
        filterByDepartmentSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('*')
  })

  it('should select the right option when role filter changes', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)

    jest
      .spyOn(rolesSelectors, 'inputSelectRolesSelector')
      .mockImplementation(() => inputSelectRolesSelectorFixture)

    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    const filterByRoleSelect = screen.getByTestId('role') as HTMLSelectElement

    // check if the default value has been set
    expect(filterByRoleSelect.value).toBe('*')

    const filterValue = 'Regievoerder'

    expect(push).not.toHaveBeenCalled()

    userEvent.selectOptions(filterByRoleSelect, filterValue)

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`role=${filterValue}`)
    )

    await screen.findByTestId('role')

    const activeOption = filterByRoleSelect.querySelector(
      'select option:checked'
    ) as HTMLOptionElement

    expect(activeOption.value).toBe(filterValue)
  })

  it('should render a user active (status) filter', async () => {
    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )
    expect(screen.getByTestId('is_active')).toBeInTheDocument()
  })

  it('should select the right option when user active (status) filter changes', async () => {
    render(withAppContext(<UsersOverview />))

    const filterByUserActiveSelect = screen.getByTestId(
      'is_active'
    ) as HTMLSelectElement

    // check if the default value has been set
    expect(filterByUserActiveSelect.value).toBe('*')

    await screen.findByTestId('is_active')

    const filterValue = 'true'

    expect(push).not.toHaveBeenCalled()

    userEvent.selectOptions(filterByUserActiveSelect, filterValue)

    await screen.findByTestId('is_active')

    expect(filterByUserActiveSelect.value).toBe(filterValue)

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith(
      expect.stringContaining(`is_active=${filterValue}`)
    )
  })

  it('sets the correct values when location pops', async () => {
    navigateSpy.mockRestore()

    render(withAppContext(<UsersOverview />))

    await waitForElementToBeRemoved(() =>
      screen.queryByTestId('loading-indicator')
    )

    const filterByRoleSelect = screen.getByTestId('role') as HTMLSelectElement
    userEvent.selectOptions(filterByRoleSelect, 'Regievoerder')

    const filterByDepartmentSelect = screen.getByTestId(
      'profile_department_code'
    ) as HTMLSelectElement
    userEvent.selectOptions(filterByDepartmentSelect, 'CCA')

    await screen.findByTestId('role')

    expect(
      (
        filterByRoleSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('Regievoerder')

    expect(
      (
        filterByDepartmentSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('CCA')

    userEvent.selectOptions(filterByRoleSelect, 'Monitor')
    userEvent.selectOptions(filterByDepartmentSelect, 'GGD')

    await screen.findByTestId('role')

    expect(
      (
        filterByRoleSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('Monitor')

    expect(
      (
        filterByDepartmentSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('GGD')

    act(() => {
      memoryHistory.goBack()
      // forcing URL update; necessary because of lack of history pop support
      memoryHistory.push(
        `${USERS_PAGED_URL}/1?role=Regievoerder&profile_department_code=CCA`
      )
    })

    await screen.findByTestId('role')

    expect(
      (
        filterByRoleSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('Regievoerder')

    expect(
      (
        filterByDepartmentSelect.querySelector(
          'select option:checked'
        ) as HTMLOptionElement
      ).value
    ).toBe('CCA')
  })
})
