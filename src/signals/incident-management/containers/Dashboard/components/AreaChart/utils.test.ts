// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { formatData, getPercentage, getToday } from './utils'
import type { AreaChartValue } from '../../charts/types'

const mockData: AreaChartValue[] = [
  { date: '01 Jan 2012', amount: 48, amount_week_earlier: 50 },
  { date: '02 Jan 2012', amount: 34, amount_week_earlier: 33 },
  { date: '03 Jan 2012', amount: 44, amount_week_earlier: 52 },
  { date: '04 Jan 2012', amount: 40, amount_week_earlier: 50 },
  { date: '05 Jan 2012', amount: 48, amount_week_earlier: 40 },
  { date: '06 Jan 2012', amount: 45, amount_week_earlier: 20 },
  {
    date: '07 Jan 2012',
    amount: 50,
    amount_week_earlier: 20,
  },
]

describe('utils', () => {
  describe('formatData', () => {
    it('should add an tooltip icon to the data of today', () => {
      const result = formatData(mockData)

      expect(result[6].image).toEqual('/assets/images/area-chart-tooltip.svg')
    })

    it('should add 12:00 to the date, otherwise vega lite cannot filter on the day', () => {
      const result = formatData(mockData)

      expect(result[0].date).toContain('12:00')
      expect(result[1].date).toContain('12:00')
    })
  })

  describe('getToday', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-02-15'))

    it('should return the date of today in the correct format', () => {
      const result = getToday()

      expect(result).toEqual({
        year: 2023,
        month: 2,
        date: 15,
        hours: 12,
        minutes: 0,
      })
    })
  })

  describe('getPercentage', () => {
    it('should return positive percentage', () => {
      const result = getPercentage(mockData)

      expect(result).toEqual({ direction: 'up', percentage: 17 })
    })

    it('should return negative percentage', () => {
      const mockDataNegative = mockData.map((item) =>
        item.date === '01 Jan 2012'
          ? {
              date: '01 Jan 2012',
              amount: 48,
              amount_week_earlier: 100,
            }
          : item
      )

      const result = getPercentage(mockDataNegative)

      expect(result).toEqual({ direction: 'down', percentage: 2 })
    })
  })
})
