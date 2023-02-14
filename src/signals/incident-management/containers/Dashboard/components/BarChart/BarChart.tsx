// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import vegaEmbed from 'vega-embed'

import { BarChartWrapper, StyledBarChart } from './styled'
import { vegaConfigBarChart } from './vega-config-bar-chart'
import { ModuleTitle } from '../ModuleTitle'

const getMaxRange = () => {
  const { innerWidth } = window
  const innerWithCalc = innerWidth > 1400 ? 1400 : innerWidth
  const maxRange = ((innerWithCalc - 160) / 3) * 2

  return maxRange / 3 - 30
}

export const BarChart = () => {
  // needs to be function later, when endpoint is available
  const maxRange = getMaxRange()

  const specs = vegaConfigBarChart(maxRange)

  const nrOfIncidents = 422
  vegaEmbed('#bar-chart', specs, { actions: false })

  return (
    <BarChartWrapper>
      <ModuleTitle
        title="Openstaande meldingen tot en met vandaag"
        amount={nrOfIncidents}
      />
      <StyledBarChart id="bar-chart" />
    </BarChartWrapper>
  )
}
