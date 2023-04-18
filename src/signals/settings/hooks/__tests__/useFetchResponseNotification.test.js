// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import { showGlobalNotification } from 'containers/App/actions'
import {
  TYPE_LOCAL,
  VARIANT_ERROR,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants'
import { withAppContext } from 'test/utils'

import useFetchResponseNotification from '../useFetchResponseNotification'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  dispatch: jest.fn(),
}))

const push = jest.fn()
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => ({
  push,
}))

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

describe('signals/settings/hooks/useFetchResponseNotification', () => {
  afterEach(() => {
    push.mockReset()
    dispatch.mockReset()
  })

  it('should not do anything', () => {
    renderHook(() =>
      withAppContext(useFetchResponseNotification({ isLoading: true }))
    )

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({ isLoading: true, error: new Error() })
      )
    )

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          isLoading: true,
          error: new Error(),
          isSuccess: true,
        })
      )
    )

    renderHook(() =>
      withAppContext(useFetchResponseNotification({ isLoading: false }))
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('should dispatch error', () => {
    const title = 'Keyboard not found. Press F1 to continue.'
    const variant = VARIANT_ERROR
    const type = TYPE_LOCAL

    renderHook(() =>
      withAppContext(useFetchResponseNotification({ error: new Error(title) }))
    )

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({ title, variant, type })
    )

    expect(push).not.toHaveBeenCalled()
  })

  it('should dispatch success', () => {
    const type = TYPE_LOCAL
    const variant = VARIANT_SUCCESS

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({ isSuccess: true, isExisting: true })
      )
    )

    expect(dispatch).toHaveBeenLastCalledWith(
      showGlobalNotification({ title: 'Gegevens bijgewerkt', variant, type })
    )

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          isSuccess: true,
          isExisting: true,
          entityName: 'Gebruiker',
        })
      )
    )

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({ title: 'Gebruiker bijgewerkt', variant, type })
    )

    expect(push).not.toHaveBeenCalled()
  })

  it('should redirect', () => {
    const redirectURL = 'https://redirect-me-here'

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({ isSuccess: true, redirectURL })
      )
    )

    expect(push).toHaveBeenCalledWith(redirectURL)
  })
})
