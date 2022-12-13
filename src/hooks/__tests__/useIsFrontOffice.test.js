// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { renderHook } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import useIsFrontOffice from '../useIsFrontOffice'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '',
    key: '',
    pathname: '/',
    search: '',
    state: null,
  }),
}))

describe('hooks/useIsFrontOffice', () => {
  it('should return a boolean', () => {
    const { result } = renderHook(() => useIsFrontOffice())

    expect(result.current).toEqual(true)

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '/manage',
      search: '',
      state: null,
    }))

    const { result: result2 } = renderHook(() => useIsFrontOffice())

    expect(result2.current).toEqual(false)

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '/instellingen',
      search: '',
      state: null,
    }))

    const { result: result3 } = renderHook(() => useIsFrontOffice())

    expect(result3.current).toEqual(false)
  })
})
