import { useCallback } from 'react'
import useFetch from 'hooks/useFetch'
import { GetHookResponse } from './types'

export const useBuildGetter = <T, U extends Array<unknown> = Array<any>>(
  paramBuilder: (...args: U) => [string, Record<string, any>]
): GetHookResponse<T, U> => {
  const { data, get: genericGet, isLoading, error, isSuccess } = useFetch<T>()
  const get = useCallback(
    (...args: U) => genericGet(...paramBuilder(...args)),
    []
  )
  return {
    data,
    get,
    isLoading,
    error,
    isSuccess,
  }
}
