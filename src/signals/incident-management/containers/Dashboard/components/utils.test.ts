// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getMaxDomain } from './utils'

const mockValues = [
  { date: '01 Jan 2012 23:00:00', amount: 48, amount_week_earlier: 30 },
  { date: '02 Jan 2012 23:00:00', amount: 34, amount_week_earlier: 33 },
  { date: '03 Jan 2012 23:00:00', amount: 44, amount_week_earlier: 32 },
  { date: '04 Jan 2012 23:00:00', amount: 40, amount_week_earlier: 10 },
  { date: '05 Jan 2012 23:00:00', amount: 48, amount_week_earlier: 40 },
  { date: '06 Jan 2012 23:00:00', amount: 45, amount_week_earlier: 20 },
  {
    date: '07 Jan 2012 23:00:00',
    amount: 50,
    amount_week_earlier: 20,
    image: '/assets/images/area-chart-tooltip.svg',
  },
]

describe('utils', () =>
  describe('getMaxDomain', () =>
    it('should return a number 20% higher then the highest amount to create white space on top of graph', () => {
      const result = getMaxDomain(mockValues)

      const maxDomain = mockValues[6].amount * 1.2

      expect(result).toEqual(maxDomain)
    })))
