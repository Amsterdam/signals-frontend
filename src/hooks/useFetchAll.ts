import { useEffect, useMemo, useCallback, useReducer } from 'react'
import type { Reducer } from 'react'
import { getAuthHeaders } from 'shared/services/auth/auth'
import { getErrorMessage } from 'shared/services/api/api'
import type { FetchError } from './useFetch'

type Data = Record<string, unknown>

interface State<T> {
  data?: T[]
  error?: boolean | FetchError
  isLoading: boolean
  isSuccess?: boolean
}

interface FetchResponse<T> extends State<T> {
  get: (urls: string[], params?: Data, requestOptions?: Data) => Promise<void>
}

/**
 * Custom hook useFetchAll
 *
 * Provides a get function taht takes URLs, calling fetch in parallel and returning the response.
 */
const useFetchAll = <T>(): FetchResponse<T> => {
  interface Action {
    payload: boolean | Data[] | FetchError
    type: string
  }

  const initialState: State<T> = {
    data: undefined,
    error: undefined,
    isLoading: false,
    isSuccess: undefined,
  }

  const reducer = (state: State<T>, action: Action): State<T> => {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload as boolean, error: false }

      case 'SET_GET_DATA':
        return {
          ...state,
          data: action.payload as T[],
          isLoading: false,
          error: false,
        }

      case 'SET_ERROR':
        return {
          ...state,
          isLoading: false,
          isSuccess: false,
          error: action.payload as FetchError,
        }

      /* istanbul ignore next */
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer<Reducer<State<T>, Action>>(
    reducer,
    initialState
  )

  const controller = useMemo(() => new AbortController(), [])
  const { signal } = controller
  const requestHeaders = useCallback(
    () => ({
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    []
  )

  useEffect(
    () => () => {
      controller.abort()
    },
    [controller]
  )

  const get: (urls: string[]) => Promise<void> = useCallback(
    async (urls) => {
      dispatch({ type: 'SET_LOADING', payload: true })

      const requests = urls.map(async (url) =>
        fetch(url, {
          headers: requestHeaders(),
          method: 'GET',
          signal,
        })
      )

      try {
        const fetchResponse = await Promise.all(requests)

        if (!fetchResponse.some((response) => !response.ok)) {
          const responseData = await Promise.all(
            fetchResponse.map((response) => response.json() as unknown as Data)
          )

          dispatch({ type: 'SET_GET_DATA', payload: responseData })
        } else {
          const errorResponse = fetchResponse.find((response) => !response.ok)

          Object.defineProperty(errorResponse, 'message', {
            value: getErrorMessage(errorResponse),
            writable: false,
          })

          dispatch({ type: 'SET_ERROR', payload: errorResponse as FetchError })
        }
      } catch (exception: unknown) {
        if (signal.aborted) return
        Object.defineProperty(exception, 'message', {
          value: getErrorMessage(exception),
          writable: false,
        })

        dispatch({ type: 'SET_ERROR', payload: exception as FetchError })
      }
    },
    [requestHeaders, signal]
  )

  return {
    get,
    ...state,
  }
}

export default useFetchAll
