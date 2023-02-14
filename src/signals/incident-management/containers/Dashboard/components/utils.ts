// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { AreaChartValue } from '../charts/types'

export const getMaxDomain = (values: AreaChartValue[]) =>
  Math.max(...values.map((v) => v.amount)) * 1.2
