// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { renderHook, act } from '@testing-library/react-hooks'
import usersJSON from 'utils/__tests__/fixtures/users.json'
import { getErrorMessage } from 'shared/services/api/api'
import * as constants from 'containers/App/constants'

import useFetchUsers from '../useFetchUsers'
import {
  rest,
  server,
  mockRequestHandler,
  fetchMock,
} from '../../../../../../../internals/testing/msw-server'
import * as API from '../../../../../../../internals/testing/api'

jest.mock('containers/App/constants', () => ({
  PAGE_SIZE: 5,
}))

fetchMock.disableMocks()

describe('signals/settings/users/containers/Overview/hooks/FetchUsers', () => {
  it('should request users from API', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers())

    act(() => {
      result.current.get()
    })

    expect(result.current.isLoading).toEqual(true)
    expect(result.current.users.count).toEqual(0)
    expect(result.current.users.list).toHaveLength(0)

    await waitForNextUpdate()

    expect(result.current.users.count).toEqual(usersJSON.count)
    expect(result.current.users.list).toHaveLength(constants.PAGE_SIZE)
    expect(result.current.users.list[0].id).toEqual(usersJSON.results[0].id)
  })

  it('should request the correct page', async () => {
    const page = 2
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers())

    act(() => {
      result.current.get({ page })
    })

    await waitForNextUpdate()

    expect(result.current.users.count).toEqual(usersJSON.count)
    expect(result.current.users.list).toHaveLength(constants.PAGE_SIZE)
    expect(result.current.users.list[0].id).toEqual(
      usersJSON.results[constants.PAGE_SIZE].id
    )
  })

  it('requests with filters', async () => {
    let request: any

    server.use(
      rest.get(/localhost/, async (req, res, ctx) => {
        request = req
        res(ctx.status(200))
      })
    )

    const filters = new URLSearchParams({
      role: 'Regievoerder',
      profile_department_code: 'ACC',
    })
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers())

    act(() => {
      result.current.get({ filters })
    })

    await waitForNextUpdate()

    expect(request.url.toString()).toEqual(
      expect.stringContaining('role=Regievoerder')
    )
    expect(request.url.toString()).toEqual(
      expect.stringContaining('profile_department_code=ACC')
    )
  })

  it('requests with filters, clearing empty values', async () => {
    let request: any

    server.use(
      rest.get(/localhost/, async (req, res, ctx) => {
        request = req
        res(ctx.status(200))
      })
    )

    const filters = new URLSearchParams({
      role: 'Regievoerder',
      profile_department_code: '',
    })
    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers())

    act(() => {
      result.current.get({ filters })
    })

    await waitForNextUpdate()

    expect(request.url.toString()).toEqual(
      expect.stringContaining('role=Regievoerder')
    )
    expect(request.url.toString()).not.toEqual(
      expect.stringContaining('profile_department_code=ACC')
    )
  })

  it('should return errors that are thrown during fetch', async () => {
    const message = 'Network request failed'
    const errorResponse = new Error()
    mockRequestHandler({ url: API.USERS, status: 404, body: { message } })

    const { result, waitForNextUpdate } = renderHook(() => useFetchUsers())

    act(() => {
      result.current.get({ page: 1 })
    })

    let { error } = result.current
    expect(error).toEqual(false)

    await waitForNextUpdate()
    ;({ error } = result.current)

    expect(typeof error !== 'boolean' && error?.message).toEqual(
      getErrorMessage(errorResponse)
    )
  })

  it('should abort request on unmount', async () => {
    const page = 1
    const message = 'Aborted'
    const body = { message }

    const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort')
    server.use(
      rest.get(/localhost/, async (_, res, ctx) =>
        res(ctx.delay(200), ctx.status(404), ctx.json(body))
      )
    )

    const { result, unmount, waitForNextUpdate } = renderHook(() =>
      useFetchUsers()
    )

    act(() => {
      result.current.get({ page })
    })

    await waitForNextUpdate()
    unmount()

    expect(abortSpy).toHaveBeenCalled()
  })
})
