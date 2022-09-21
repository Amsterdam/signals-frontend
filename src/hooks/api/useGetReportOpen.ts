// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import type { Report } from 'types/api/report'

import { useBuildGetter } from './useBuildGetter'

const useGetReportOpen = () =>
  useBuildGetter<Report>((params?: { start?: string; end?: string }) => [
    `${configuration.REPORTS_ENDPOINT}open`,
    { start: params?.start, end: params?.end },
  ])

export default useGetReportOpen
