import configuration from 'shared/services/configuration/configuration'
import type { Questionnaire } from 'types/api/qa/questionnaire'
import { useBuildGetter } from '../useBuildGetter'

const useGetQuestionnaire = () =>
  useBuildGetter<Questionnaire>((uuid: string) => [
    `${configuration.QA_QUESTIONNAIRES_ENDPOINT}${uuid}`,
  ])

export default useGetQuestionnaire
