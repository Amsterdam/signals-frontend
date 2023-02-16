// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export interface AreaChartValue {
  date: string
  amount: number
  amount_week_earlier: number
  image?: string
}

type Status =
  | 'Heropend'
  | 'Extern: afgehandeld'
  | 'Ingepland'
  | 'Verzoek tot heropenen'
  | 'Reactie ontvangen'
  | 'In behandeling'
  | 'Gesplitst'
  | 'Reactie gevraagd'
  | 'Gemeld'
  | 'Afwachting van behandeling'
  | 'Extern: verzoek tot afhandeling'

export interface StatusListItem {
  query: string
  label: Status
}

export interface BarChartValue {
  status: Status
  nrOfIncidents: number
}

export type Today = {
  year: number
  month: number
  date: number
  hours: number
  minutes: number
}
