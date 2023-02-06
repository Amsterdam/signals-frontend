// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { VisualizationSpec } from 'vega-embed'

export const vegaConfigBarChart: VisualizationSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A bar chart showing showing number of incidents per status',
  data: {
    values: [
      { status: 'Heropend', nrOfIncidentsPerStatus: 0 },
      { status: 'Extern: afgehandeld', nrOfIncidentsPerStatus: 54 },
      { status: 'Ingepland', nrOfIncidentsPerStatus: 75 },
      { status: 'Verzoek tot heropenen', nrOfIncidentsPerStatus: 22 },
      { status: 'Reactie ontvangen', nrOfIncidentsPerStatus: 560 },
      { status: 'In behandeling', nrOfIncidentsPerStatus: 82 },
      { status: 'Gesplitst', nrOfIncidentsPerStatus: 32 },
      { status: 'Reactie gevraagd', nrOfIncidentsPerStatus: 60 },
      { status: 'Gemeld', nrOfIncidentsPerStatus: 1103 },
      { status: 'Afwachting van behandeling', nrOfIncidentsPerStatus: 409 },
      { status: 'Extern: verzoek tot afhandeling', nrOfIncidentsPerStatus: 64 },
    ],
  },
  transform: [
    {
      calculate: 'max(2, datum.nrOfIncidentsPerStatus)',
      as: 'nrOfIncidentsPerStatusWithMax',
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
    sort: [false],
  },
  spec: {
    layer: [
      {
        mark: { type: 'bar' },
        encoding: {
          x: {
            aggregate: 'mean',
            field: 'nrOfIncidentsPerStatusWithMax',
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
        encoding: { text: { field: 'nrOfIncidentsPerStatus' } },
      },
      {
        mark: 'rule',
        encoding: {
          x: { aggregate: 'mean', field: 'nrOfIncidentsPerStatusWithMax' },
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
}
