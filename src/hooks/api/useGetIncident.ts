import { useFetch } from 'hooks'
import { useEffect } from 'react'
import configuration from 'shared/services/configuration/configuration'
import { Incident } from 'types/api/incident'
import { FetchHookResponse } from './types'

type UseGetIncident = (id?: number) => FetchHookResponse<Incident>

const useGetIncident: UseGetIncident = (id?: number) => {
  const { data, get, isLoading, error, isSuccess } = useFetch<Incident>()

  useEffect(() => {
    if (id) {
      get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`)
    }
  }, [get, id])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetIncident
