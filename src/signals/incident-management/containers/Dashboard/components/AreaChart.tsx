// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import vegaEmbed from 'vega-embed'
import type { EmbedOptions } from 'vega-embed'

import { getAreaChart } from '../charts'
import { ModuleTitle } from '../components/ModuleTitle'

/** Mock data */
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

// TODO: Retrieve this value from the data
const today = { year: 2012, month: 1, date: 7, hours: 23, minutes: 0 }

const getMaxDomain = (values: typeof mockValues) => {
  let max = 0
  let total = 0
  values.forEach((value, index) => {
    if (index + 1 > values.length - 1) return
    max =
      value.amount > values[index + 1].amount
        ? value.amount
        : values[index + 1].amount
    total = total + value.amount
  })

  return max + (total / 100) * 7.5
}

const timeFormatLocale = {
  dateTime: '%a %e %B %Y %X',
  date: '%d-%m-%Y',
  time: '%H:%M:%S',
  periods: ['AM', 'PM'],
  days: [
    'zondag',
    'maandag',
    'dinsdag',
    'woensdag',
    'donderdag',
    'vrijdag',
    'zaterdag',
  ],
  shortDays: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
  months: [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ],
  shortMonths: [
    'jan',
    'feb',
    'mrt',
    'apr',
    'mei',
    'jun',
    'jul',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec',
  ],
}

const embedOptions: EmbedOptions = {
  actions: false,
  timeFormatLocale,
  mode: 'vega-lite',
}

export const AreaChart = () => {
  const maxDomain = getMaxDomain(mockValues)
  const AreaChartSpecs = getAreaChart(mockValues, maxDomain, today)

  vegaEmbed('#area-chart', AreaChartSpecs, embedOptions)

  return (
    <div>
      <ModuleTitle
        title="Afgehandelde meldingen vandaag"
        subtitle="Verloop van de week"
      />
      <div id="area-chart"></div>
    </div>
  )
}
