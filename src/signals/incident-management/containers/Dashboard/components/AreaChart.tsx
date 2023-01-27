// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import vegaEmbed from 'vega-embed'
import type { EmbedOptions } from 'vega-embed'

import { getAreaChart } from '../charts'
import { constants } from '../charts'
import { ModuleTitle } from '../components/ModuleTitle'
import { getMaxDomain } from './utils'

// TODO: Retrieve this value from the data
const today = { year: 2012, month: 1, date: 7, hours: 23, minutes: 0 }

const embedOptions: EmbedOptions = {
  actions: false,
  timeFormatLocale: constants.timeFormatLocale,
  mode: 'vega-lite',
}

export const AreaChart = () => {
  const maxDomain = getMaxDomain(constants.mockValues)
  const AreaChartSpecs = getAreaChart(constants.mockValues, maxDomain, today)

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
