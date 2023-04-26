// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

import type { RawData } from './types'
import { constants } from '../../charts'
import type { BarChartValue } from '../../charts'

export const getQueryList = (queryString: string) => {
  const endpoint = configuration.INCIDENT_PRIVATE_ENDPOINT
  return constants.statusList.map((status) => {
    const params = queryString
      ? `${queryString}&status=${status.query}`
      : `status=${status.query}`
    return `${endpoint}stats/total?${params}`
  })
}

export const formatData = (rawData: RawData[]): BarChartValue[] =>
  rawData.map((value, i) => ({
    status: constants.statusList[i].label,
    nrOfIncidents: value.total,
  }))

export const getTotalNrOfIncidents = (rawData: RawData[]): number =>
  rawData.reduce((aggregatedTotal, value) => aggregatedTotal + value.total, 0)

export const getMaxDomain = (data: BarChartValue[]) => {
  const maxNrOfIncidents = Math.max(...data.map((value) => value.nrOfIncidents))
  return maxNrOfIncidents > 0 ? maxNrOfIncidents : 1
}
