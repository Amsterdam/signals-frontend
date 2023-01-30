// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import vegaEmbed from 'vega-embed'
import type { EmbedOptions } from 'vega-embed'

import { getAreaChart } from '../charts'
import { constants } from '../charts'
import { ModuleTitle } from '../components/ModuleTitle'
import { ComparisonRate } from './ComparisonRate'
import { AreaChartWrapper as Wrapper } from './styled'
import { getMaxDomain } from './utils'

/**
 * Mock data. Should be retrieved form backend when ready.
 */
const mockToday = { year: 2012, month: 1, date: 7, hours: 23, minutes: 0 }
const mockPercentage = 12
const mockValues = [
  { date: '01 Jan 2012 23:00:00', amount: 48 },
  { date: '02 Jan 2012 23:00:00', amount: 34 },
  { date: '03 Jan 2012 23:00:00', amount: 44 },
  { date: '04 Jan 2012 23:00:00', amount: 40 },
  { date: '05 Jan 2012 23:00:00', amount: 48 },
  { date: '06 Jan 2012 23:00:00', amount: 45 },
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
      <ModuleTitle
        title="Afgehandelde meldingen vandaag"
        subtitle="Verloop van de week"
      />
      <div id="area-chart"></div>
      <ComparisonRate percentage={mockPercentage} />
    </Wrapper>
  )
}
