// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import vegaEmbed from 'vega-embed'

import { StyledBarChart, Wrapper } from './styled'
import { vegaConfigBarChart } from './vega-config-bar-chart'
import { ModuleTitle } from '../ModuleTitle'

export const BarChart = () => {
  // needs to be function later, when endpoint is available
  const nrOfIncidents = 422
  vegaEmbed('#bar-chart', vegaConfigBarChart, { actions: false })
  //prop title of ModuleTitle has two spaces at the end in accordance with the design
  return (
    <Wrapper>
      <ModuleTitle
        title="Openstaande meldingen tot en met vandaag  "
        amount={nrOfIncidents}
      />
      <StyledBarChart data-testid="bar-chart" id="bar-chart" />
    </Wrapper>
  )
}
