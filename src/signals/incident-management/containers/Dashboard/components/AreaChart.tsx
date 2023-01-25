// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import vegaEmbed from 'vega-embed'

import { getAreaChart } from '../charts'
import { ModuleTitle } from '../components/ModuleTitle'

/** Mock data */
const mockValues = [
  { a: '01 Jan 2012 23:00:00', b: 48 },
  { a: '02 Jan 2012 23:00:00', b: 34 },
  { a: '03 Jan 2012 23:00:00', b: 44 },
  { a: '04 Jan 2012 23:00:00', b: 40 },
  { a: '05 Jan 2012 23:00:00', b: 48 },
  { a: '06 Jan 2012 23:00:00', b: 45 },
  { a: '07 Jan 2012 23:00:00', b: 47 },
]

const getMaxDomain = (values: typeof mockValues) => {
  let max = 0
  let total = 0
  values.forEach((value, index) => {
    if (index + 1 > values.length - 1) return
    max = value.b > values[index + 1].b ? value.b : values[index + 1].b
    total = total + value.b
  })

  return max + (total / 100) * 10
}

export const AreaChart = () => {
  const maxDomain = getMaxDomain(mockValues)
  const AreaChartSpecs = getAreaChart(mockValues, maxDomain)

  vegaEmbed('#area-chart', AreaChartSpecs, { actions: false })

  return (
    <div>
      <ModuleTitle
        title="Afgehandelde meldingen vandaag"
        subtitle="Verloop van de week"
      />
      <div id="area-chart" />
    </div>
  )
}
