import { useFetch } from 'hooks'
import { useEffect } from 'react'
import configuration from 'shared/services/configuration/configuration'
import { Session } from 'types/api/qa/session'

const useGetSession = (uuid: string) => {
  const { data, get, isLoading, error, isSuccess } = useFetch<Session>()

  useEffect(() => {
    if (uuid) {
      get(`${configuration.QA_SESSIONS_ENDPOINT}${uuid}`)
    }
  }, [get, uuid])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetSession
