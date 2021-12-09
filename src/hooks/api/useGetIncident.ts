import configuration from 'shared/services/configuration/configuration'
import type { Incident } from 'types/api/incident'
import { useBuildGetter } from './useBuildGetter'

const useGetIncident = () =>
  useBuildGetter<Incident>((id: number) => [
    `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`,
  ])

export default useGetIncident
