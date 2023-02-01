// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export const vegaConfigBarChart: any = {
  $schem: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A bar chart showing cases with their statusses',
  data: {
    values: [
      { a: 'Heropend', b: 0 },
      { a: 'Extern: afgehandeld', b: 54 },
      { a: 'Ingepland', b: 75 },
      { a: 'Verzoek tot heropenen', b: 22 },
      { a: 'Reactie ontvangen', b: 560 },
      { a: 'In behandeling', b: 82 },
      { a: 'Gesplitst', b: 32 },
      { a: 'Reactie gevraagd', b: 60 },
      { a: 'Gemeld', b: 1103 },
      { a: 'Afwachting van behandeling', b: 409 },
      { a: 'Extern: verzoek tot afhandeling', b: 64 },
    ],
  },
  //
  transform: [{ calculate: 'max(0.2, datum.b)', as: 'c' }],
  spacing: 5,
  facet: {
    field: 'a',
    type: 'nominal',
    title: null,
    header: {
      labelAnchor: 'start',
      labelFontSize: 14,
      labelFontWeight: 400,
      labelPadding: 4,
      labelFont: 'Amsterdam Sans',
    },
    sort: [null],
  },
  spec: {
    layer: [
      {
        mark: { type: 'bar' },
        encoding: {
          x: {
            aggregate: 'mean',
            field: 'c',
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
          x: 5,
          fontSize: 12,
          fontWeight: 700,
          font: 'Amsterdam Sans',
        },
        encoding: { text: { field: 'b' } },
      },
      {
        mark: 'rule',
        encoding: {
          x: { aggregate: 'mean', field: 'c' },
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
