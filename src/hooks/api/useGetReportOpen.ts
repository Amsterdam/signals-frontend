import configuration from 'shared/services/configuration/configuration'
import { Report } from 'types/api/report'
import { useBuildGetter } from './useBuildGetter'

const useGetReportOpen = () =>
  useBuildGetter<Report>(({ start, end }: { start?: string; end?: string }) => [
    `${configuration.REPORTS_ENDPOINT}open`,
    { start, end },
  ])

export default useGetReportOpen
