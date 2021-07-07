import configuration from 'shared/services/configuration/configuration'
import { Question } from 'types/api/qa/question'
import { useBuildGetter } from '../useBuildGetter'

const useGetQuestion = () =>
  useBuildGetter<Question>((uuid: string) => [
    `${configuration.QA_QUESTIONS_ENDPOINT}${uuid}`,
    {},
  ])

export default useGetQuestion
