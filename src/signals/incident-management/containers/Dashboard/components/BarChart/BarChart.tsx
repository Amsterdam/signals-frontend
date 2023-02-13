// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useState } from 'react'

import vegaEmbed from 'vega-embed'

import { BarChartWrapper, StyledBarChart } from './styled'
import { vegaConfigBarChart } from './vega-config-bar-chart'
import { ModuleTitle } from '../ModuleTitle'
import { getMaxRange } from '../../utils/get-max-range'

export const BarChart = () => {
  const [sizeChart, setSizeChart] = useState(getMaxRange())
  // needs to be function later, when endpoint is available
  const specs = vegaConfigBarChart(sizeChart)

  const nrOfIncidents = 422
  vegaEmbed('#bar-chart', specs, { actions: false })

  const onResize = () => {
    setSizeChart(getMaxRange())
  }

  window.addEventListener('resize', onResize)

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
