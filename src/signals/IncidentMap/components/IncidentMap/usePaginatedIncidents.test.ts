// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import fetchMock from 'jest-fetch-mock'

import usePaginatedIncidents from './usePaginatedIncidents'

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

const useFetchResponse = {
  features: new Array(4000).fill(feature),
}

const useFetchResponseSmall = {
  features: new Array(223).fill(feature),
}

// TODO: these tests broke when updating MSW, should be fixed
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('usePaginationTest', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should called once and return an empty array', async function () {
    fetchMock.once(JSON.stringify(useFetchResponse), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Total-Count': '4000',
      },
    })

    const hook = renderHook(usePaginatedIncidents)

    const { getIncidents } = hook.result.current

    expect(fetchMock).toBeCalledTimes(0)

    getIncidents({
      east: '123',
      north: '123',
      west: '123',
      south: '123',
    })

    expect(fetchMock).toBeCalledTimes(1)

    await hook.waitForNextUpdate()

    expect(hook.result.current.incidents).toEqual([])
  })

  it('should call getIncidents get incidents after waiting for the state update', async () => {
    fetchMock
      .once(JSON.stringify(useFetchResponse), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Total-Count': '4000',
        },
      })
      .once(JSON.stringify(useFetchResponseSmall), {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Total-Count': '4000',
        },
      })

    const hook = renderHook(usePaginatedIncidents)

    const { getIncidents } = hook.result.current

    getIncidents({
      east: '123',
      north: '123',
      west: '123',
      south: '123',
    })

    expect(hook.result.current.incidents).toHaveLength(0)

    await hook.waitForNextUpdate()

    expect(hook.result.current.incidents).toHaveLength(223)
  })

  it('should  trigger the first catch', async () => {
    fetchMock.once(JSON.stringify(useFetchResponse), {
      status: 401,
      headers: {
        Accept: 'application/json',
        'X-Total-Count': '4000',
      },
    })

    const hook = renderHook(usePaginatedIncidents)

    const { getIncidents } = hook.result.current

    getIncidents({
      east: '123',
      north: '123',
      west: '123',
      south: '123',
    })

    await hook.waitForNextUpdate()

    expect(hook.result.current.error?.message).toMatch(/HTTP status code: 401/)
  })

  it('should  trigger the second catch', async () => {
    fetchMock
      .once(JSON.stringify(useFetchResponse), {
        status: 200,
        headers: {
          Accept: 'application/json',
          'X-Total-Count': '4000',
        },
      })
      .once('', {
        status: 200,
        headers: {
          Accept: 'application/',
          'X-Total-Count': '4000',
        },
      })

    const hook = renderHook(usePaginatedIncidents)

    const { getIncidents } = hook.result.current

    getIncidents({
      east: '123',
      north: '123',
      west: '123',
      south: '123',
    })

    await hook.waitForNextUpdate()

    expect(hook.result.current.error?.message).toMatch(/invalid json/)
  })

  it('should  trigger the second catch with statuses', async () => {
    fetchMock
      .once(JSON.stringify(useFetchResponse), {
        status: 200,
        headers: {
          Accept: 'application/json',
          'X-Total-Count': '4000',
        },
      })
      .once(JSON.stringify(useFetchResponse), {
        status: 400,
        headers: {
          Accept: 'application/',
          'X-Total-Count': '4000',
        },
      })

    const hook = renderHook(usePaginatedIncidents)

    const { getIncidents } = hook.result.current

    getIncidents({
      east: '123',
      north: '123',
      west: '123',
      south: '123',
    })

    await hook.waitForNextUpdate()

    expect(hook.result.current.error?.message).toMatch(/HTTP status codes: 400/)
  })
})
