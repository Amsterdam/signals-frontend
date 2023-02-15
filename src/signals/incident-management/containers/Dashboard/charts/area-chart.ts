// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { VisualizationSpec } from 'vega-embed'

import type { Today, AreaChartValue } from './types'

export const getAreaChartSpec = (
  values: Array<AreaChartValue>,
  maxDomain: number,
  today: Today
): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 430,
  height: 220,
  data: {
    values,
  },

  /** Axis */
  encoding: {
    x: {
      field: 'date',
      type: 'ordinal',
      title: null,
      timeUnit: 'day',
      sort: null,
      axis: {
        ticks: false,
        labelAngle: 0,
        domain: false,
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
      title: null,
      axis: {
        tickMinStep: 1,
        grid: false,
        ticks: false,
        domain: false,
        offset: -15,
        labelFontSize: 14,
        labelFontWeight: 700,
        labelFont: 'Amsterdam Sans',
        labelLineHeight: 16,
      },
    },
  },
  layer: [
    /** Graph */
    { mark: { type: 'area', line: true } },
    {
      mark: { type: 'point' },
      params: [
        {
          name: 'highlight',
          select: { type: 'point', on: 'mouseover' },
        },
      ],
    },

    /** Tooltip amount previous six days */
    {
      transform: [
        {
          filter: {
            not: {
              field: 'date',
              equal: today,
            },
          },
        },
      ],
      mark: {
        type: 'text',
        yOffset: -10,
        color: '#004699',
      },
      encoding: {
        text: {
          condition: {
            param: 'highlight',
            empty: false,
            field: 'amount',
            type: 'quantitative',
          },
        },
      },
    },

    /** Tooltip background today */
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

    /** Tooltip amount today */
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
        yOffset: -17.5,
        color: 'white',
      },
      encoding: { text: { field: 'amount' } },
    },
  ],

  /** Config */
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
        filled: true,
        opacity: 1,
        cursor: 'pointer',
      },
      text: {
        align: 'center',
        baseline: 'bottom',
        fontSize: 12,
        fontWeight: 700,
      },
      cell: {
        stroke: 'transparent',
      },
    },
  },
})
