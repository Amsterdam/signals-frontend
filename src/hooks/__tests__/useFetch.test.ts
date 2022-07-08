// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import fetchMock from 'jest-fetch-mock'
import { renderHook, act } from '@testing-library/react-hooks'
import JSONresponse from 'utils/__tests__/fixtures/user.json'
import { getErrorMessage } from 'shared/services/api/api'
import { getAuthHeaders } from 'shared/services/auth/auth'
import { mocked } from 'jest-mock'

import type { FetchError } from '../useFetch'
import useFetch from '../useFetch'

jest.mock('shared/services/auth/auth')

const mockGetAuthHeaders = mocked(getAuthHeaders)
const URL = 'https://here-is-my.api/someId/6'

describe('hooks/useFetch', () => {
  beforeAll(() => {
    fetchMock.mockResponse(JSON.stringify(JSONresponse))
  })

  describe('get', () => {
    it('should request from URL on mount', async () => {
      const { result, unmount } = renderHook(() => useFetch())

      expect(result.current.isLoading).toEqual(false)
      expect(result.current.data).toBeUndefined()

      await act(() => result.current.get(URL))

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'GET',
        })
      )

      expect(result.current.isLoading).toEqual(false)
      expect(result.current.data).toEqual(JSONresponse)

      unmount()
    })

    it('should use correct request headers', async () => {
      const { result } = renderHook(() => useFetch())
      const authHeader = { Authorization: 'Bearer token' }

      await act(() => result.current.get(URL))

      expect(fetchMock).not.toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<
            string,
            unknown
          >,
        })
      )

      mockGetAuthHeaders.mockImplementation(() => authHeader)

      await act(() => result.current.get(URL))

      expect(fetchMock).toHaveBeenLastCalledWith(
        URL,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<
            string,
            unknown
          >,
        })
      )
    })

    it('should construct a URL with query params', async () => {
      const params = {
        foo: 'bar',
        qux: 'zork',
      }

      const { result } = renderHook(() => useFetch())

      await act(() => result.current.get(URL, params))

      expect(fetchMock).toHaveBeenCalledWith(
        `${URL}?foo=bar&qux=zork`,
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('should construct a URL with complex query params', async () => {
      const params = {
        foo: 'bar',
        qux: 'zork',
        category: ['a', 'b', 'c'],
      }

      const { result } = renderHook(() => useFetch())

      await act(() => result.current.get(URL, params))

      expect(fetchMock).toHaveBeenCalledWith(
        `${URL}?category=a&category=b&category=c&foo=bar&qux=zork`,
        expect.objectContaining({
          method: 'GET',
        })
      )
    })

    it('should return errors that are thrown during fetch', async () => {
      const error = new Error()
      const message = getErrorMessage(error)
      fetchMock.mockRejectOnce(error)

      const { result } = renderHook(() => useFetch())

      const get = act(() => result.current.get(URL))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).toEqual(false)

      await get

      expect(result.current.error).toEqual(error)
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should abort get request on unmount', async () => {
      const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort')

      const { result, unmount } = renderHook(() => useFetch())

      await act(() => result.current.get(URL))

      expect(abortSpy).not.toHaveBeenCalled()

      unmount()

      expect(abortSpy).toHaveBeenCalled()
      abortSpy.mockReset()
    })

    it('should abort modify request on unmount', async () => {
      const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort')

      const { result, unmount } = renderHook(() => useFetch())

      await act(() => result.current.patch(URL, {}))

      expect(abortSpy).not.toHaveBeenCalled()

      unmount()

      expect(abortSpy).toHaveBeenCalled()
    })

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' }
      const message = getErrorMessage(response)

      fetchMock.mockResponseOnce(
        JSON.stringify({ detail: 'invalid token' }),
        response
      )

      const { result } = renderHook(() => useFetch())

      const get = act(() => result.current.get(URL))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).toEqual(false)

      await get

      expect(result.current.error).toEqual(expect.objectContaining(response))
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should apply request options', async () => {
      const { result } = renderHook(() => useFetch())
      const params = {}
      const requestOptions = { responseType: 'blob' }

      await act(() => result.current.get(URL, params, requestOptions))

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'GET',
          ...requestOptions,
        })
      )
    })
  })

  describe('patch', () => {
    it('should send PATCH request', async () => {
      fetchMock.mockResponse(JSON.stringify(JSONresponse))

      const { result } = renderHook(() => useFetch())

      const formData = { ...JSONresponse, is_active: false }

      fetchMock.mockResponseOnce(JSON.stringify(formData))

      const expectRequest = [
        URL,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'PATCH',
        }),
      ]

      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(true)

      expect(fetchMock).not.toHaveBeenLastCalledWith(...expectRequest)

      await act(() => result.current.patch(URL, formData))

      expect(fetchMock).toHaveBeenLastCalledWith(...expectRequest)

      expect(result.current.isSuccess).toEqual(true)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' }
      const message = getErrorMessage(response)
      const formData = { ...JSONresponse, is_active: false }
      const { result } = renderHook(() => useFetch())

      fetchMock.mockResponseOnce(
        JSON.stringify({ detail: 'invalid token' }),
        response
      )

      const patch = act(() => result.current.patch(URL, formData))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).not.toEqual(
        expect.objectContaining(response)
      )
      // value of isSuccess can be one of `undefined`, `false`, or `true`
      expect(result.current.isSuccess).not.toEqual(false)

      await patch

      expect(result.current.error).toEqual(expect.objectContaining(response))
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isSuccess).toEqual(false)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should apply request options', async () => {
      const { result } = renderHook(() => useFetch())
      const formData = {}
      const requestOptions = { responseType: 'blob' }

      await act(() => result.current.patch(URL, formData, requestOptions))

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'PATCH',
          ...requestOptions,
        })
      )
    })
  })

  describe('post', () => {
    it('should send POST request', async () => {
      const { result } = renderHook(() => useFetch())

      const formData = {
        first_name: JSONresponse.first_name,
        last_name: JSONresponse.last_name,
        username: JSONresponse.username,
      }

      fetchMock.mockResponseOnce(JSON.stringify(JSONresponse))

      const expectRequest = [
        URL,
        expect.objectContaining({
          body: JSON.stringify(formData),
          method: 'POST',
        }),
      ]

      expect(fetchMock).not.toHaveBeenCalledWith(...expectRequest)

      const post = act(() => result.current.post(URL, formData))

      expect(result.current.isSuccess).not.toEqual(true)

      await post

      expect(fetchMock).toHaveBeenCalledWith(...expectRequest)

      expect(result.current.isSuccess).toEqual(true)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' }
      const message = getErrorMessage(response)
      const formData = { ...JSONresponse, is_active: false }
      const { result } = renderHook(() => useFetch())

      fetchMock.mockResponseOnce(
        JSON.stringify({ detail: 'invalid token' }),
        response
      )

      const post = act(() => result.current.post(URL, formData))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).not.toEqual(
        expect.objectContaining(response)
      )
      expect(result.current.isSuccess).not.toEqual(false)

      await post

      expect(result.current.error).toEqual(expect.objectContaining(response))
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isSuccess).toEqual(false)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should apply request options', async () => {
      const { result } = renderHook(() => useFetch())
      const formData = {}
      const requestOptions = { responseType: 'blob' }

      await act(() => result.current.post(URL, formData, requestOptions))

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'POST',
          ...requestOptions,
        })
      )
    })
  })

  describe('delete', () => {
    it('should send DELETE request', async () => {
      const { result } = renderHook(() => useFetch())

      const expectRequest = [
        URL,
        expect.objectContaining({
          method: 'DELETE',
        }),
      ]

      expect(fetchMock).not.toHaveBeenCalledWith(...expectRequest)

      const del = act(() => result.current.del(URL))

      expect(result.current.isSuccess).not.toEqual(true)

      await del

      expect(fetchMock).toHaveBeenCalledWith(...expectRequest)

      expect(result.current.isSuccess).toEqual(true)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' }
      const message = getErrorMessage(response)
      const { result } = renderHook(() => useFetch())

      fetchMock.mockResponseOnce(
        JSON.stringify({ detail: 'invalid token' }),
        response
      )

      const del = act(() => result.current.del(URL))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).not.toEqual(
        expect.objectContaining(response)
      )
      expect(result.current.isSuccess).not.toEqual(false)

      await del

      expect(result.current.error).toEqual(expect.objectContaining(response))
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isSuccess).toEqual(false)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should apply request options', async () => {
      const { result } = renderHook(() => useFetch())
      const requestOptions = { responseType: 'blob' }

      await act(() => result.current.del(URL, requestOptions))

      expect(fetchMock).toHaveBeenCalledWith(
        URL,
        expect.objectContaining({
          method: 'DELETE',
          ...requestOptions,
        })
      )
    })
  })
})
