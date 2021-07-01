import { useFetch } from 'hooks'
import { useEffect } from 'react'
import configuration from 'shared/services/configuration/configuration'
import { Report } from 'types/api/report'
import { FetchHookResponse } from './types'

const useGetReportOpen = ({
  start,
  end,
}: {
  start?: string
  end?: string
} = {}): FetchHookResponse<Report> => {
  const { data, get, isLoading, error, isSuccess } = useFetch<Report>()

  useEffect(() => {
    get(`${configuration.REPORTS_ENDPOINT}open`, { start, end })
  }, [end, get, start])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetReportOpen
