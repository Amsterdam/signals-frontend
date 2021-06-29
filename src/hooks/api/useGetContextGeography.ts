import { useFetch } from 'hooks'
import { useEffect } from 'react'
import configuration from 'shared/services/configuration/configuration'
import { Geography } from 'types/api/geography'
import { FetchHookResponse } from './types'

type UseGetContextGeography = (id?: number) => FetchHookResponse<Geography>

const useGetIncidentContextGeography: UseGetContextGeography = (
  id?: number
) => {
  const { data, get, isLoading, error, isSuccess } = useFetch<Geography>()

  useEffect(() => {
    if (id) {
      get(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/near/geography`
      )
    }
  }, [get, id])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetIncidentContextGeography
