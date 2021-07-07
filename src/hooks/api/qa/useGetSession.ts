import configuration from 'shared/services/configuration/configuration'
import { Session } from 'types/api/qa/session'
import { useBuildGetter } from '../useBuildGetter'

const useGetSession = () =>
  useBuildGetter<Session>((uuid: string) => [
    `${configuration.QA_SESSIONS_ENDPOINT}${uuid}`,
    {},
  ])

export default useGetSession
