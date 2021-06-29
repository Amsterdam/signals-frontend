import { useFetch } from 'hooks'
import { useEffect, useMemo } from 'react'
import configuration from 'shared/services/configuration/configuration'
import Reporter from 'types/api/reporter'
import { FetchHookResponse, QueryParameters } from './types'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE = 1

type UseGetContextReporter = (
  id: number,
  params: QueryParameters
) => FetchHookResponse<Reporter>

const useGetContextReporter: UseGetContextReporter = (
  id,
  { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE }
) => {
  const { get, data, error, isLoading, isSuccess } = useFetch<Reporter>()

  const searchParams = useMemo(
    () =>
      new URLSearchParams({
        page: `${page}`,
        page_size: `${pageSize}`,
      }).toString(),
    [page, pageSize]
  )

  const params = searchParams ? `?${searchParams}` : ''

  useEffect(() => {
    if (id) {
      get(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/reporter${params}`
      )
    }
  }, [get, id, params, searchParams])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetContextReporter
