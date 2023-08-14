import type { FetchError } from 'hooks/useFetch'

export const isFetchError = (
  error?: boolean | FetchError
): error is FetchError => {
  return (
    ((error as FetchError)?.detail || (error as FetchError)?.message) !==
    undefined
  )
}
