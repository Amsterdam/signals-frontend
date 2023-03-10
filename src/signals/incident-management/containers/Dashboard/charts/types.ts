// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export interface AreaChartValue {
  date: string
  amount: number
  amount_week_earlier: number
  image?: string
}

export interface BarChartValue {
  status: string
  nrOfIncidents: number
}

export type Today = {
  year: number
  month: number
  date: number
  hours: number
  minutes: number
}
