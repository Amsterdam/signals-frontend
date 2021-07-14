import fetchMock from 'jest-fetch-mock'
import { mocked } from 'ts-jest/utils'
import { renderHook, act } from '@testing-library/react-hooks'
import JSONresponse from 'utils/__tests__/fixtures/user.json'

import { getErrorMessage } from 'shared/services/api/api'
import { getAuthHeaders } from 'shared/services/auth/auth'
import type { FetchError } from 'hooks/useFetch'
import useFetchAll from '../useFetchAll'

jest.mock('shared/services/auth/auth')

const mockGetAuthHeaders = mocked(getAuthHeaders)
const URL1 = 'https://here-is-my.api/someId/6'
const URL2 = 'https://here-is-my.api/someId/7'

describe('hooks/useFetchAll', () => {
  beforeEach(() => {
    fetchMock.mockResponse(JSON.stringify(JSONresponse))
    fetchMock.mockResponse(JSON.stringify(JSONresponse))
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('get', () => {
    it('should request from URLs on mount', async () => {
      const { result } = renderHook(() => useFetchAll())

      expect(result.current.isLoading).toEqual(false)
      expect(result.current.data).toBeUndefined()

      const get = result.current.get([URL1, URL2])

      expect(result.current.isLoading).toEqual(true)

      expect(fetchMock).toHaveBeenCalledWith(
        URL1,
        expect.objectContaining({
          method: 'GET',
        })
      )
      expect(fetchMock).toHaveBeenCalledTimes(2)

      await get

      expect(result.current.isLoading).toEqual(false)
      expect(result.current.data).toEqual([JSONresponse, JSONresponse])
    })

    it('should use correct request headers', async () => {
      const { result } = renderHook(() => useFetchAll())
      const authHeader = { Authorization: 'Bearer token' }

      await act(() => result.current.get([URL1]))

      expect(fetchMock).not.toHaveBeenCalledWith(
        URL1,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<
            string,
            unknown
          >,
        })
      )

      mockGetAuthHeaders.mockImplementation(() => authHeader)

      await act(() => result.current.get([URL1]))

      expect(fetchMock).toHaveBeenLastCalledWith(
        URL1,
        expect.objectContaining({
          headers: expect.objectContaining(authHeader) as Record<
            string,
            unknown
          >,
        })
      )
    })

    it('should return errors that are thrown during fetch', async () => {
      const error = new Error()
      const message = getErrorMessage(error)
      fetchMock.mockRejectOnce(error)

      const { result } = renderHook(() => useFetchAll())

      const get = act(() => result.current.get([URL1]))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).toEqual(false)

      await get

      expect(result.current.error).toEqual(error)
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isLoading).toEqual(false)
    })

    it('should abort request on unmount', async () => {
      const abortSpy = jest.spyOn(global.AbortController.prototype, 'abort')

      const { result, unmount } = renderHook(() => useFetchAll())

      await act(() => result.current.get([URL1]))

      expect(abortSpy).not.toHaveBeenCalled()

      unmount()

      expect(abortSpy).toHaveBeenCalled()
    })

    it('should throw on error response', async () => {
      const response = { status: 401, ok: false, statusText: 'Unauthorized' }
      const message = getErrorMessage(response)

      fetchMock.mockResponse('', response)

      const { result } = renderHook(() => useFetchAll())

      const get = act(() => result.current.get([URL1]))

      expect(result.current.isLoading).toEqual(true)
      expect(result.current.error).toEqual(false)

      await get

      expect(result.current.error).toEqual(expect.objectContaining(response))
      expect((result.current.error as FetchError).message).toEqual(message)
      expect(result.current.isLoading).toEqual(false)
    })
  })
})
