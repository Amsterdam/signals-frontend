// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { renderHook } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import useIsIncidentMap from '../useIsIncidentMap'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    hash: '',
    key: '',
    pathname: '/meldingenkaart',
    search: '',
    state: null,
  }),
}))

describe('hooks/useIsIncidentMap', () => {
  it('should return a boolean', () => {
    const { result } = renderHook(() => useIsIncidentMap())

    expect(result.current).toEqual(true)

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementationOnce(() => ({
      hash: '',
      key: '',
      pathname: '/manage',
      search: '',
      state: null,
    }))

    const { result: result2 } = renderHook(() => useIsIncidentMap())

    expect(result2.current).toEqual(false)

    jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
      hash: '',
      key: '',
      pathname: '/incident/beschrijf',
      search: '',
      state: null,
    }))

    const { result: result3 } = renderHook(() => useIsIncidentMap())

    expect(result3.current).toEqual(false)
  })
})
