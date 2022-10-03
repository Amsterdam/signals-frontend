import configuration from 'shared/services/configuration/configuration'
import type { PublicIncident } from 'types/api/public-incident'

import { useBuildGetter } from './useBuildGetter'

const useGetPublicIncident = () =>
  useBuildGetter<PublicIncident>((uuid: string) => [
    `${configuration.INCIDENT_PUBLIC_ENDPOINT}${uuid}`,
  ])

export default useGetPublicIncident
