import configuration from 'shared/services/configuration/configuration'
import type { Report } from 'types/api/report'
import { useBuildGetter } from './useBuildGetter'

const useGetReportReopenRequested = () =>
  useBuildGetter<Report>(({ start, end }: { start?: string; end?: string }) => [
    `${configuration.REPORTS_ENDPOINT}reopen-requested`,
    { start, end },
  ])

export default useGetReportReopenRequested
