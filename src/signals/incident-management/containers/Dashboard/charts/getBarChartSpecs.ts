// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { VisualizationSpec } from 'vega-embed'

import type { BarChartValue } from './types'

export const getBarChartSpecs = (
  values: BarChartValue[],
  maxDomain: number
): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A bar chart showing showing number of incidents per status',
  data: {
    values: values,
  },
  spacing: 5,
  facet: {
    field: 'status',
    title: null,
    header: {
      labelAnchor: 'start',
      labelFontSize: 14,
      labelFontWeight: 400,
      labelPadding: 4,
      labelFont: 'Amsterdam Sans',
    },
    sort: null,
  },
  spec: {
    layer: [
      {
        mark: {
          type: 'bar',
          xOffset: 22,
        },
        encoding: {
          x: {
            aggregate: 'sum',
            field: 'nrOfIncidents',
            title: null,
            scale: {
              domain: [0, maxDomain],
              rangeMax: 275,
            },
            axis: null,
          },
        },
      },

      {
        mark: { type: 'rule', xOffset: 22 },
        encoding: {
          x: {
            field: 'nrOfIncidents',
            aggregate: 'sum',
          },
          y: {
            value: 22,
          },
          size: {
            value: 4,
          },
        },
      },

      {
        mark: {
          type: 'text',
          x: 7.5,
          fontSize: 12,
          fontWeight: 700,
          align: 'left',
          font: 'Amsterdam Sans',
        },
        encoding: {
          text: {
            field: 'nrOfIncidents',
            type: 'quantitative',
          },
        },
      },
    ],
  },
  columns: 3,
  config: {
    style: {
      bar: {
        color: '#004699',
        opacity: 0.6,
        size: 27,
      },
      rule: {
        color: '#004699',
      },
      cell: {
        stroke: 'transparent',
      },
    },
  },
})
