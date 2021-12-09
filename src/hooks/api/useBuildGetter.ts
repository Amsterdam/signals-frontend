import { useMemo } from 'react'
import useFetch from 'hooks/useFetch'
import type { GetHookResponse } from './types'

export const useBuildGetter = <T, U extends Array<unknown> = Array<any>>(
  paramBuilder: (...args: U) => [string] | [string, Record<string, any>]
): GetHookResponse<T, U> => {
  const { get: genericGet, ...rest } = useFetch<T>()
  const get = useMemo(
    () =>
      (...args: U) => {
        const [url, params] = paramBuilder(...args)
        return genericGet(url, params)
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [genericGet]
  )

  return {
    ...rest,
    get,
  }
}
