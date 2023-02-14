// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { EmbedOptions } from 'vega-embed'
import vegaEmbed from 'vega-embed'

import { ComparisonRate } from './ComparisonRate'
import { ModuleTitle } from './ModuleTitle'
import { AreaChartWrapper as Wrapper, StyledAreaChart } from './styled'
import { getMaxDomain } from './utils'
import { constants, getAreaChart } from '../charts'

/**
 * Mock data. Should be retrieved form backend when ready.
 */
const mockToday = { year: 2012, month: 1, date: 7, hours: 23, minutes: 0 }
const mockPercentage = 12
const mockValues = [
  {
    date: '01 Jan 2012 23:00:00',
    amount: 48,
    image: '/assets/images/area-chart-tooltip.svg',
  },
  {
    date: '02 Jan 2012 23:00:00',
    amount: 34,
    image: '/assets/images/area-chart-tooltip.svg',
  },
  {
    date: '03 Jan 2012 23:00:00',
    amount: 44,
    image: '/assets/images/area-chart-tooltip.svg',
  },
  {
    date: '04 Jan 2012 23:00:00',
    amount: 40,
    image: '/assets/images/area-chart-tooltip.svg',
  },
  {
    date: '05 Jan 2012 23:00:00',
    amount: 48,
    image: '/assets/images/area-chart-tooltip.svg',
  },
  {
    date: '06 Jan 2012 23:00:00',
    amount: 45,
    image: '/assets/images/area-chart-tooltip.svg',
  },
  {
    date: '07 Jan 2012 23:00:00',
    amount: 50,
    image: '/assets/images/area-chart-tooltip.svg',
  },
]

const embedOptions: EmbedOptions = {
  actions: false,
  timeFormatLocale: constants.timeFormatLocale,
  mode: 'vega-lite',
}

export const AreaChart = () => {
  const maxDomain = getMaxDomain(mockValues)

  const AreaChartSpecs = getAreaChart(mockValues, maxDomain, mockToday)

  vegaEmbed('#area-chart', AreaChartSpecs, embedOptions)

  return (
    <Wrapper>
      <ModuleTitle title="Afgehandelde meldingen afgelopen 7 dagen" />
      <StyledAreaChart id="area-chart" />
      {/* <ComparisonRate percentage={mockPercentage} /> */}
    </Wrapper>
  )
}
