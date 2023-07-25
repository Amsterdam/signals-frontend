// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import * as reactRouterDom from 'react-router-dom'

import * as useConfirm from 'components/Confirmation/useConfirm'
import * as appSelectors from 'containers/App/selectors'
import * as modelSelectors from 'models/departments/selectors'
import * as rolesSelectors from 'models/roles/selectors'
import configuration from 'shared/services/configuration/configuration'
import routes from 'signals/settings/routes'
import { withAppContext } from 'test/utils'
import { departments } from 'utils/__tests__/fixtures'
import historyFixture from 'utils/__tests__/fixtures/history.json'
import inputCheckboxRolesSelectorJson from 'utils/__tests__/fixtures/inputCheckboxRolesSelector.json'
import rolesFixture from 'utils/__tests__/fixtures/roles.json'
import userFixture from 'utils/__tests__/fixtures/user.json'

import UserDetail from '..'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('containers/App/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/selectors'),
}))

const navigateMock = jest.fn()
const isConfirmedMock = jest.fn()
const origUseConfirm = useConfirm.useConfirm

jest.mock('models/departments/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/departments/selectors'),
}))

jest.mock('models/roles/selectors', () => ({
  __esModule: true,
  ...jest.requireActual('models/roles/selectors'),
}))

jest.spyOn(useConfirm, 'useConfirm').mockImplementation(() => {
  const orig = origUseConfirm()
  return {
    ...orig,
    isConfirmed: isConfirmedMock,
  }
})

jest
  .spyOn(modelSelectors, 'makeSelectDepartments')
  .mockImplementation(() => departments)

jest
  .spyOn(rolesSelectors, 'inputCheckboxRolesSelector')
  .mockImplementation(() => inputCheckboxRolesSelectorJson)

jest
  .spyOn(rolesSelectors, 'rolesModelSelector')
  .mockImplementation(() => ({ list: rolesFixture }))

const userId = userFixture.id

describe('signals/settings/users/containers/Detail', () => {
  beforeEach(() => {
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => navigateMock)
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => true)
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId: userFixture.id }))

    fetch
      .mockResponseOnce(JSON.stringify(userFixture))
      .mockResponseOnce(JSON.stringify(historyFixture))
  })

  afterEach(() => {
    fetch.resetMocks()
    navigateMock.mockReset()
  })

  it('should render a backlink', async () => {
    const referrer = '/some-page-we-came-from'
    const { findByTestId, getByTestId, rerender, unmount } = render(
      withAppContext(<UserDetail />)
    )

    const backlink = await findByTestId('backlink')

    expect(backlink.getAttribute('href')).toEqual(routes.users)

    jest
      .spyOn(reactRouterDom, 'useLocation')
      .mockImplementation(() => ({ referrer }))

    unmount()

    rerender(withAppContext(<UserDetail />))

    await findByTestId('backlink')

    expect(getByTestId('backlink').closest('a').getAttribute('href')).toEqual(
      referrer
    )
  })

  it('should render the correct title', async () => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId: undefined }))

    const { findByText, rerender, unmount } = render(
      withAppContext(<UserDetail />)
    )

    const addTitle = await findByText('Gebruiker toevoegen')

    expect(addTitle).toBeInTheDocument()

    unmount()

    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId }))

    rerender(withAppContext(<UserDetail />))

    const editTitle = await findByText('Gebruiker wijzigen')

    expect(editTitle).toBeInTheDocument()
  })

  it('should get user and history data', async () => {
    const { findByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    expect(fetch).toHaveBeenCalledTimes(2)

    const [url, params] = fetch.mock.calls[0]
    expect(url).toEqual(`${configuration.USERS_ENDPOINT}${userId}`)
    expect(params).toEqual(expect.objectContaining({ method: 'GET' }))

    const [historyUrl, historyParams] = fetch.mock.calls[1]
    expect(historyUrl).toEqual(
      `${configuration.USERS_ENDPOINT}${userId}/history`
    )
    expect(historyParams).toEqual(expect.objectContaining({ method: 'GET' }))
  })

  it('should render a loading indicator', async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(
      withAppContext(<UserDetail />)
    )

    expect(getByTestId('loading-indicator')).toBeInTheDocument()

    await findByTestId('user-detail-form-container')

    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument()
  })

  it('should not render a form when the data from the API is not yet available', async () => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId }))

    const { findByTestId, queryByTestId } = render(
      withAppContext(<UserDetail />)
    )

    expect(queryByTestId('detail-user-form')).not.toBeInTheDocument()

    await findByTestId('user-detail-form-container')

    expect(queryByTestId('detail-user-form')).toBeInTheDocument()
  })

  it('should render a form when the URL does not contain a user ID', async () => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId: undefined }))

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    expect(getByTestId('detail-user-form')).toBeInTheDocument()
  })

  it('should not patch user data on submit when form data has not been altered', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    act(() => {
      fireEvent.click(
        getByTestId('detail-user-form').querySelector('[type="submit"]')
      )
    })

    await findByTestId('user-detail-form-container')

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('should patch user data on submit', async () => {
    const { findByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    userEvent.type(
      screen.getByRole('textbox', { name: /achternaam/i }),
      'Foo Bar Baz'
    )
    userEvent.click(screen.getByRole('button', { name: /opslaan/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${configuration.USERS_ENDPOINT}${userId}`,
        expect.objectContaining({ method: 'PATCH' })
      )
    })
  })

  it('should NOT patch user data on submit when user does not have permissions', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => false)

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    act(() => {
      fireEvent.change(
        getByTestId('detail-user-form').querySelector('#last_name'),
        { target: { value: 'Foo Bar Baz' } }
      )
    })

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    act(() => {
      fireEvent.submit(document.forms[0])
    })

    await findByTestId('user-detail-form-container')

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('should post user data on submit', async () => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId: undefined }))

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    const lastName = 'Foo Bar Baz'
    act(() => {
      fireEvent.change(
        getByTestId('detail-user-form').querySelector('#last_name'),
        { target: { value: lastName } }
      )
    })

    const firstName = 'Zork'
    act(() => {
      fireEvent.change(
        getByTestId('detail-user-form').querySelector('#first_name'),
        { target: { value: firstName } }
      )
    })

    const username = 'zork@foobarbaz.com'
    act(() => {
      fireEvent.change(
        getByTestId('detail-user-form').querySelector('#username'),
        {
          target: { value: username },
        }
      )
    })

    expect(fetch).not.toHaveBeenCalledWith(
      configuration.USERS_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    )

    act(() => {
      fireEvent.click(
        getByTestId('detail-user-form').querySelector('[type="submit"]')
      )
    })

    await findByTestId('user-detail-form-container')

    const [url, params] = fetch.mock.calls[0]
    const body = JSON.parse(params.body)
    expect(url).toEqual(configuration.USERS_ENDPOINT)
    expect(body).toEqual(
      expect.objectContaining({
        last_name: lastName,
        first_name: firstName,
        username,
      })
    )
  })

  it('should NOT post user data on submit when user does not have permissions', async () => {
    jest
      .spyOn(appSelectors, 'makeSelectUserCan')
      .mockImplementation(() => () => false)

    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ userId: undefined }))

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    const lastName = 'Foo Bar Baz'
    fireEvent.change(
      getByTestId('detail-user-form').querySelector('#last_name'),
      { target: { value: lastName } }
    )

    const firstName = 'Zork'
    fireEvent.change(
      getByTestId('detail-user-form').querySelector('#first_name'),
      { target: { value: firstName } }
    )

    expect(fetch).not.toHaveBeenCalledWith(
      configuration.USERS_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    )

    fireEvent.submit(document.forms[0])

    expect(fetch).not.toHaveBeenCalledWith(
      configuration.USERS_ENDPOINT,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('should convert stringified booleans to boolean values', async () => {
    fetch.resetMocks()

    fetch
      .once(JSON.stringify({ ...userFixture, is_active: false }))
      .once(JSON.stringify(historyFixture))

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    // ensure that a boolean value is a string value
    expect(
      getByTestId('detail-user-form').querySelector(
        '[name="is_active"][value="false"]'
      ).checked
    ).toBe(true)

    expect(fetch).not.toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )

    act(() => {
      // change a field's value so that the form will be submitted
      fireEvent.change(
        getByTestId('detail-user-form').querySelector('#last_name'),
        { target: { value: 'Foo Bar Baz' } }
      )
    })

    act(() => {
      fireEvent.click(
        getByTestId('detail-user-form').querySelector('[type="submit"]')
      )
    })

    await findByTestId('user-detail-form-container')

    const [url, params] = fetch.mock.calls[2]
    const body = JSON.parse(params.body)

    expect(url).toEqual(`${configuration.USERS_ENDPOINT}${userId}`)
    expect(body).toEqual(
      expect.objectContaining({
        is_active: false,
      })
    )

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.USERS_ENDPOINT}${userId}`,
      expect.objectContaining({ method: 'PATCH' })
    )
  })

  it('should direct to the overview page when cancel button is clicked and form data is pristine', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({}))

    isConfirmedMock.confirm = jest.fn()

    const { findByTestId, rerender, getByTestId } = render(
      withAppContext(<UserDetail />)
    )

    await findByTestId('user-detail-form-container')

    expect(navigateMock).toHaveBeenCalledTimes(0)

    act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    expect(isConfirmedMock).not.toHaveBeenCalled()

    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith(
      expect.stringContaining(routes.users)
    )

    rerender(withAppContext(<UserDetail />))

    expect(navigateMock).toHaveBeenCalledTimes(1)

    act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    expect(isConfirmedMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledTimes(2)
    expect(navigateMock).toHaveBeenCalledWith(
      expect.stringContaining(routes.users)
    )
  })

  it('should direct to the overview page when cancel button is clicked and form data is NOT pristine', async () => {
    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({}))

    const { findByTestId, getByTestId } = render(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    expect(navigateMock).not.toHaveBeenCalled()

    await act(() => {
      fireEvent.change(
        getByTestId('detail-user-form').querySelector('#last_name'),
        { target: { value: 'Foo Bar Baz' } }
      )
    })

    await act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    expect(isConfirmedMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledTimes(0)

    isConfirmedMock.mockReturnValue(true)

    await act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    expect(isConfirmedMock).toHaveBeenCalledTimes(2)
    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith(
      expect.stringContaining(routes.users)
    )
  })

  it('should navigateMock to correct URL when cancel button is clicked and form data is pristine', async () => {
    const referrer = '/some-page-we-came-from'
    jest
      .spyOn(reactRouterDom, 'useLocation')
      .mockImplementation(() => ({ referrer }))

    const { findByTestId, rerender, getByTestId } = render(
      withAppContext(<UserDetail />)
    )

    await findByTestId('user-detail-form-container')

    expect(navigateMock).not.toHaveBeenCalled()

    await act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    // user is only asked for confirmation when form data isn't pristine
    expect(navigateMock).toHaveBeenCalledTimes(1)
    expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining(referrer))

    jest
      .spyOn(reactRouterDom, 'useLocation')
      .mockImplementation(() => ({ referrer }))

    rerender(withAppContext(<UserDetail />))

    await findByTestId('user-detail-form-container')

    await act(() => {
      fireEvent.click(getByTestId('cancel-btn'))
    })

    // user is only asked for confirmation when form data isn't pristine

    isConfirmedMock.mockReset()
    isConfirmedMock.mockReturnValue(true)
    expect(isConfirmedMock).not.toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledTimes(2)
    expect(navigateMock).toHaveBeenCalledWith(expect.stringContaining(referrer))
  })
})
