// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { VisualizationSpec } from 'vega-embed'

import type { Today, IncidentCount } from './types'

export const getAreaChart = (
  values: Array<IncidentCount>,
  maxDomain: number,
  today: Today
): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 430,
  height: 220,
  data: {
    values,
  },
  encoding: {
    x: {
      field: 'date',
      type: 'ordinal',
      title: '',
      timeUnit: 'day',
      sort: null,
      axis: {
        ticks: false,
        labelAngle: 0,
        domainColor: 'white',
        offset: 10,
        labelFontSize: 14,
        labelFontWeight: 700,
        labelFont: 'Amsterdam Sans',
        labelLineHeight: 16,
        labelSeparation: 10,
      },
    },
    y: {
      field: 'amount',
      type: 'quantitative',
      scale: { type: 'linear', domain: [0, maxDomain] },
      title: '',
      axis: {
        grid: false,
        ticks: false,
        domainColor: 'white',
        offset: -15,
        labelFontSize: 14,
        labelFontWeight: 700,
        labelFont: 'Amsterdam Sans',
        labelLineHeight: 16,
      },
    },
  },
  layer: [
    { mark: { type: 'area', line: true, point: true } },
    {
      transform: [
        {
          filter: {
            field: 'date',
            equal: today,
          },
        },
      ],
      mark: { type: 'image', width: 35, height: 35, yOffset: -22 },
      encoding: { url: { field: 'image', type: 'nominal' } },
    },
    {
      transform: [
        {
          filter: {
            field: 'date',
            equal: today,
          },
        },
      ],
      mark: {
        type: 'text',
        align: 'center',
        baseline: 'bottom',
        yOffset: -17.5,
        fontSize: 12,
        fontWeight: 700,
        color: 'white',
      },
      encoding: { text: { field: 'amount' } },
    },
  ],
  config: {
    style: {
      area: {
        color: '#FEECEB',
      },
      line: {
        color: '#004699',
        strokeWidth: 1,
      },
      point: {
        color: '#004699',
        size: 140,
      },
      cell: {
        stroke: 'transparent',
      },
    },
  },
})
