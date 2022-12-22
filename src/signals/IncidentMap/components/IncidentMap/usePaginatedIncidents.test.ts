// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
// eslint-disable-next-line no-restricted-imports
import React from 'react'

import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'

import useFetch from '../../../../hooks/useFetch'
import usePaginatedIncidents from './usePaginatedIncidents'

jest.mock('hooks/useFetch')

export const del = jest.fn()
export const get = jest.fn()
export const patch = jest.fn()
export const post = jest.fn()
export const put = jest.fn()

const feature = {
  type: 'Feature',
  id: 'container.118431',
  geometry_name: '118431',
  geometry: {
    type: 'Point',
    coordinates: [4.90459473852556, 52.3884112183925],
  },
  properties: {
    id: '118431',
  },
}

const features = new Array(4000).fill(feature)

const useFetchResponse = {
  del,
  get,
  patch,
  post,
  put,
  data: { features },
  isLoading: false,
  error: false,
  isSuccess: false,
}

const useFetchResponseSmall = {
  ...useFetchResponse,
  data: {
    features: new Array(223).fill(feature),
  },
}

describe('usePaginationTest', function () {
  beforeEach(() => {
    get.mockReset()
  })

  it('should call get twice', function () {
    jest
      .mocked(useFetch)
      .mockImplementationOnce(() => useFetchResponse)
      .mockImplementationOnce(() => useFetchResponseSmall)

    jest.spyOn(React, 'useRef').mockImplementationOnce(() => ({
      current: {
        page: 3,
        features: [],
        searchParams: new URLSearchParams(),
      },
    }))

    const { result } = renderHook(usePaginatedIncidents)

    const { getIncidents } = result.current

    act(() => {
      getIncidents({
        east: '123',
        north: '123',
        west: '123',
        south: '123',
      })
    })

    expect(get).toBeCalledTimes(2)
  })

  it('should call get once', function () {
    jest.mocked(useFetch).mockImplementationOnce(() => useFetchResponseSmall)

    const { result } = renderHook(usePaginatedIncidents)

    const { getIncidents } = result.current

    act(() => {
      getIncidents({
        east: '123',
        north: '123',
        west: '123',
        south: '123',
      })
    })

    expect(get).toBeCalledTimes(1)
  })
})
