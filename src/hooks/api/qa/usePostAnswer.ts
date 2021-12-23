import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import type { Answer } from 'types/api/qa/answer'

export const usePostAnswer = () => {
  const { post: originalPost, ...rest } = useFetch<Answer>()

  const post = (session: string, question: string, payload: unknown) =>
    originalPost(`${configuration.QA_QUESTIONS_ENDPOINT}${question}/answer`, {
      payload,
      session,
    })

  return { post, ...rest }
}
