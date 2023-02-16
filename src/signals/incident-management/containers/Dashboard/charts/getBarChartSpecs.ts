// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { VisualizationSpec } from 'vega-embed'

import type { BarChartValue } from './types'

export const getBarChartSpecs = (
  values: BarChartValue[]
): VisualizationSpec => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A bar chart showing showing number of incidents per status',
  data: {
    values,
  },
  transform: [
    {
      calculate: 'max(2, datum.nrOfIncidents)',
      as: 'nrOfIncidentsWithMax',
    },
  ],
  spacing: 5,
  facet: {
    field: 'status',
    type: 'nominal',
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
        mark: { type: 'bar' },
        encoding: {
          x: {
            aggregate: 'mean',
            field: 'nrOfIncidentsWithMax',
            title: null,
            axis: null,
            scale: { rangeMax: 275 },
          },
        },
      },
      {
        mark: {
          type: 'text',
          align: 'left',
          x: 15,
          fontSize: 12,
          fontWeight: 700,
          font: 'Amsterdam Sans',
        },
        encoding: { text: { field: 'nrOfIncidents' } },
      },
      {
        mark: 'rule',
        encoding: {
          x: { aggregate: 'mean', field: 'nrOfIncidentsWithMax' },
          color: { value: '#004699' },
          size: { value: 4 },
          x2: { value: 0 },
          y: { value: 23 },
        },
      },
    ],
  },
  columns: 3,
  config: {
    style: {
      cell: { stroke: 'transparent' },
      bar: { color: '#004699', opacity: 0.6, size: 27 },
    },
  },
})
