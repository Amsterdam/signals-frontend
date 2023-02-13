// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { VisualizationSpec } from 'vega-embed'

export const vegaConfigBarChart: VisualizationSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A bar chart showing showing number of incidents per status',
  data: {
    values: [
      { status: 'Heropend', nrOfIncidentsPerStatus: 3909 },
      { status: 'Extern: afgehandeld', nrOfIncidentsPerStatus: 54 },
      { status: 'Ingepland', nrOfIncidentsPerStatus: 75 },
      { status: 'Verzoek tot heropenen', nrOfIncidentsPerStatus: 200 },
      { status: 'Reactie ontvangen', nrOfIncidentsPerStatus: 560 },
      { status: 'In behandeling', nrOfIncidentsPerStatus: 82 },
      { status: 'Gesplitst', nrOfIncidentsPerStatus: 3832 },
      { status: 'Reactie gevraagd', nrOfIncidentsPerStatus: 15 },
      { status: 'Gemeld', nrOfIncidentsPerStatus: 3903 },
      { status: 'Afwachting van behandeling', nrOfIncidentsPerStatus: 409 },
      { status: 'Extern: verzoek tot afhandeling', nrOfIncidentsPerStatus: 0 },
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
    sort: null,
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
            scale: { rangeMax: 204 },
          },
        },
      },
      {
        mark: {
          type: 'text',
          align: 'left',
          x: 15,
          fontSize: 14,
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
    padding: 0,
    style: {
      cell: { stroke: 'transparent' },
      bar: { color: '#004699', opacity: 0.5, size: 27 },
    },
  },
}
