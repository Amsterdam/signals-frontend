import { useFetch } from 'hooks'
import { useEffect } from 'react'
import configuration from 'shared/services/configuration/configuration'
import { Questionnaire } from 'types/api/qa/questionnaire'

const useGetQuestionnaire = (uuid: string) => {
  const { data, get, isLoading, error, isSuccess } = useFetch<Questionnaire>()

  useEffect(() => {
    if (uuid) {
      get(`${configuration.QA_QUESTIONNAIRES_ENDPOINT}${uuid}`)
    }
  }, [get, uuid])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetQuestionnaire
