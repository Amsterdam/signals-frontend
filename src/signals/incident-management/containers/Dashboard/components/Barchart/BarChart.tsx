// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { Content } from './styled'
import { mockData } from './mock-data'
import vegaEmbed from 'vega-embed'

const Barchart = () => {
  vegaEmbed('#bar-chart', mockData)
  return (
    <>
      <Content>
        <div id="bar-chart" />
      </Content>
    </>
  )
}

export default Barchart
