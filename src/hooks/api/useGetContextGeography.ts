import configuration from 'shared/services/configuration/configuration'
import type { Geography } from 'types/api/geography'
import { useBuildGetter } from './useBuildGetter'

const useGetIncidentContextGeography = () =>
  useBuildGetter<Geography>((id: number) => [
    `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/near/geography`,
  ])

export default useGetIncidentContextGeography
