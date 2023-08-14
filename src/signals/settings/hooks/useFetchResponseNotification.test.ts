// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import { showGlobalNotification } from 'containers/App/actions'
import {
  TYPE_GLOBAL,
  VARIANT_ERROR,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants'
import { withAppContext } from 'test/utils'

import useFetchResponseNotification from './useFetchResponseNotification'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  dispatch: jest.fn(),
}))

const navigateSpy = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateSpy)

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

const defaultProps = {
  entityName: 'Categorie',
  isLoading: false,
  redirectURL: '../overview',
}

describe('signals/settings/hooks/useFetchResponseNotification', () => {
  afterEach(() => {
    navigateSpy.mockReset()
    dispatch.mockReset()
  })

  it('should not do anything', () => {
    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({ ...defaultProps, isLoading: true })
      )
    )

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          ...defaultProps,
          isLoading: true,
          error: new Error(),
        })
      )
    )

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          ...defaultProps,
          isLoading: true,
          error: new Error(),
          isSuccess: true,
        })
      )
    )

    renderHook(() =>
      withAppContext(useFetchResponseNotification({ ...defaultProps }))
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(navigateSpy).not.toHaveBeenCalled()
  })

  it('should dispatch error', () => {
    const title = 'Keyboard not found. Press F1 to continue.'
    const variant = VARIANT_ERROR
    const type = TYPE_GLOBAL

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          ...defaultProps,
          error: new Error(title),
        })
      )
    )

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({ title, variant, type })
    )

    expect(navigateSpy).not.toHaveBeenCalled()
  })

  it('should dispatch success', () => {
    const type = TYPE_GLOBAL
    const variant = VARIANT_SUCCESS

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({ ...defaultProps, isSuccess: true })
      )
    )

    expect(dispatch).toHaveBeenLastCalledWith(
      showGlobalNotification({ title: 'Categorie bijgewerkt', variant, type })
    )

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          ...defaultProps,
          isSuccess: true,
          entityName: 'Gebruiker',
        })
      )
    )

    expect(dispatch).toHaveBeenCalledWith(
      showGlobalNotification({ title: 'Gebruiker bijgewerkt', variant, type })
    )
  })

  it('should redirect', () => {
    const redirectURL = 'https://redirect-me-here'

    renderHook(() =>
      withAppContext(
        useFetchResponseNotification({
          ...defaultProps,
          isSuccess: true,
          redirectURL,
        })
      )
    )

    expect(navigateSpy).toHaveBeenCalledWith(redirectURL)
  })
})
