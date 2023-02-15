// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Direction } from './ComparisonRate'
import type { ComparisonRateType } from './ComparisonRate'
import type { AreaChartValue as Value, Today } from '../../charts/types'

export const formatData = (values: Value[]): Value[] => {
  return values.map((value, i) =>
    i === values.length - 1
      ? {
          ...value,
          date: `${value.date} 12:00`,
          image: '/assets/images/area-chart-tooltip.svg',
        }
      : { ...value, date: `${value.date} 12:00` }
  )
}

export const getToday = (): Today => {
  const today = new Date()

  return {
    year: today.getFullYear(),
    // Vega lite does not work with zero indexed months
    month: today.getMonth() + 1,
    date: today.getDate(),
    hours: 12,
    minutes: 0o0,
  }
}

export const getPercentage = (values: Value[]): ComparisonRateType => {
  const thisWeek = values.reduce((total, value) => total + value.amount, 0)
  const lastWeek = values.reduce(
    (total, value) => total + value.amount_week_earlier,
    0
  )

  return {
    direction: thisWeek < lastWeek ? Direction.DOWN : Direction.UP,
    percentage: Math.abs(Math.round((thisWeek / lastWeek - 1) * 100)),
  }
}
