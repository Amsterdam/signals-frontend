import { useFetch } from 'hooks'
import { useEffect } from 'react'
import configuration from 'shared/services/configuration/configuration'
import { Question } from 'types/api/qa/question'

const useGetQuestion = (uuid: string) => {
  const { data, get, isLoading, error, isSuccess } = useFetch<Question>()

  useEffect(() => {
    if (uuid) {
      get(`${configuration.QA_QUESTIONS_ENDPOINT}${uuid}`)
    }
  }, [get, uuid])

  return {
    data,
    isLoading,
    error,
    isSuccess,
  }
}

export default useGetQuestion
