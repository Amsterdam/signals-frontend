// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { Reducer } from 'react'
import { useCallback, useEffect, useReducer, useMemo } from 'react'

import { getErrorMessage } from 'shared/services/api/api'
import { getAuthHeaders } from 'shared/services/auth/auth'

type Data = Record<string, unknown>
export type FetchError = (Response | Error) & {
  message: string
  detail?: string
}

export interface State<T> {
  data?: T
  error?: boolean | FetchError
  isLoading: boolean
  isSuccess?: boolean
}

export interface FetchResponse<T> extends State<T> {
  del: (url: string, requestOptions?: Data) => Promise<void>
  get: (
    url: string,
    params?: Data,
    requestOptions?: Data,
    optionalHeaders?: Data
  ) => Promise<void>
  patch: (
    url: string,
    modifiedData: unknown,
    requestOptions?: Data
  ) => Promise<void>
  post: (
    url: string,
    modifiedData?: unknown,
    requestOptions?: Data
  ) => Promise<void>
  put: (
    url: string,
    modifiedData: unknown,
    requestOptions?: Data
  ) => Promise<void>
}

/**
 * Custom hook useFetch
 *
 * Will take a URL and an optional object of parameters and use those to construct a request URL
 * with, call fetch and return the response.
 *
 * @returns {FetchResponse}
 */
const useFetch = <T>(): FetchResponse<T> => {
  interface Action {
    payload: boolean | Data | FetchError
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
          data: action.payload as T,
          isLoading: false,
          error: false,
        }

      case 'SET_MODIFY_DATA':
        return {
          ...state,
          data: action.payload as T,
          isLoading: false,
          error: false,
          isSuccess: true,
        }

      case 'SET_DELETE_DATA':
        return {
          ...state,
          isLoading: false,
          error: false,
          isSuccess: true,
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

  const get = useCallback(
    async (
      url,
      params = {},
      requestOptions: Data = {},
      optionalHeaders: Data = {}
    ) => {
      dispatch({ type: 'SET_LOADING', payload: true })

      const arrayParams = Object.entries(params)
        .filter(([, value]) => Array.isArray(value))
        .flatMap(([key, value]) =>
          (value as string[]).flatMap((val: string) => `${key}=${val}`)
        )

      const scalarParams = Object.entries(params)
        .filter(([, value]) => Boolean(value) && !Array.isArray(value))
        .flatMap(([key, value]) => `${key}=${value}`)

      const queryParams = arrayParams.concat(scalarParams).join('&')
      const requestURL = [url, queryParams].filter(Boolean).join('?')

      try {
        const fetchResponse = await fetch(requestURL, {
          headers: { ...requestHeaders(), ...optionalHeaders },
          method: 'GET',
          signal,
          ...requestOptions,
        })

        const responseData = (
          requestOptions.responseType === 'blob'
            ? await fetchResponse.blob()
            : await fetchResponse.json()
        ) as Data

        if (fetchResponse.ok) {
          dispatch({ type: 'SET_GET_DATA', payload: responseData })
        } else {
          Object.defineProperty(fetchResponse, 'message', {
            value: getErrorMessage(fetchResponse),
            writable: false,
          })

          if (responseData.detail) {
            Object.defineProperty(fetchResponse, 'detail', {
              value: responseData.detail,
              writable: false,
            })
          }

          dispatch({ type: 'SET_ERROR', payload: fetchResponse as FetchError })
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

  const modify = useCallback(
    (method: string) =>
      async (
        url: RequestInfo,
        modifiedData: unknown,
        requestOptions: Data = {}
      ) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        try {
          const modifyResponse = await fetch(url, {
            headers: requestHeaders(),
            method,
            signal,
            body: JSON.stringify(modifiedData),
            ...requestOptions,
          })

          const responseData = (
            requestOptions.responseType === 'blob'
              ? await modifyResponse.blob()
              : await modifyResponse.json()
          ) as Data

          if (modifyResponse.ok) {
            dispatch({ type: 'SET_MODIFY_DATA', payload: responseData })
          } else {
            Object.defineProperty(modifyResponse, 'message', {
              value: getErrorMessage(modifyResponse),
              writable: false,
            })

            if (responseData.detail) {
              Object.defineProperty(modifyResponse, 'detail', {
                value: responseData.detail,
                writable: false,
              })
            }

            dispatch({
              type: 'SET_ERROR',
              payload: modifyResponse as FetchError,
            })
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

  const post = useMemo(() => modify('POST'), [modify])
  const patch = useMemo(() => modify('PATCH'), [modify])
  const put = useMemo(() => modify('PUT'), [modify])

  const del = useCallback(
    async (url: RequestInfo, requestOptions: Data = {}) => {
      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        const deleteResponse = await fetch(url, {
          headers: requestHeaders(),
          method: 'DELETE',
          signal,
          ...requestOptions,
        })

        if (deleteResponse.ok) {
          dispatch({ type: 'SET_DELETE_DATA', payload: {} })
        } else {
          Object.defineProperty(deleteResponse, 'message', {
            value: getErrorMessage(deleteResponse),
            writable: false,
          })

          dispatch({
            type: 'SET_ERROR',
            payload: deleteResponse as FetchError,
          })
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

  /**
   * @typedef {Object} FetchResponse
   * @property {Object} data - Fetch response
   * @property {Error} error - Error object thrown during fetch and data parsing
   * @property {Function} del - Function that expects a URL
   * @property {Function} get - Function that expects a URL and a query parameter object
   * @property {Boolean} isLoading - Indicator of fetch request status
   * @property {Boolean} isSuccess - Indicator of post or patch request status
   * @property {Function} patch - Function that expects a URL and a data object as parameters
   * @property {Function} post - Function that expects a URL and a data object as parameters
   */
  return {
    del,
    get,
    patch,
    post,
    put,
    ...state,
  }
}

export default useFetch
