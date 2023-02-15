// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useBuildGetter } from 'hooks/api/useBuildGetter'
import configuration from 'shared/services/configuration/configuration'

import type { AreaChartValue } from '../charts/types'

export const useGetAreaChart = () =>
  useBuildGetter<AreaChartValue[]>(() => {
    return [configuration.INCIDENTS_PAST_WEEK]
  })
