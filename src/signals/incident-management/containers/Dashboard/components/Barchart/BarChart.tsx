// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { Wrapper } from './styled'
import { vegaConfigBarChart } from './vega-config-bar-chart'
import vegaEmbed from 'vega-embed'

export const BarChart = () => {
  vegaEmbed('#bar-chart', vegaConfigBarChart)
  return (
    <>
      <Wrapper data-testid="bar-chart-wrapper">
        <div id="bar-chart" />
      </Wrapper>
    </>
  )
}
