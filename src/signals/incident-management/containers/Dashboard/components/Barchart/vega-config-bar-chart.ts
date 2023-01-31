// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export const vegaConfigBarChart: any = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A bar chart showing cases with their statusses',
  data: {
    values: [
      { a: 'Heropend', b: '18' },
      { a: 'Extern: afgehandeld', b: '54' },
      { a: 'Ingepland', b: '75' },
      { a: 'Verzoek tot heropenen', b: '25' },
      { a: 'Reactie ontvangen', b: '56' },
      { a: 'In behandeling', b: '82' },
      { a: 'Gesplitst', b: '32' },
      { a: 'Reactie gevraagd', b: '60' },
      { a: 'Gemeld', b: '103' },
      { a: 'Afwachting van behandeling', b: '40' },
      { a: 'Extern: verzoek tot afhandeling', b: '64' },
    ],
  },
  spacing: 5,
  facet: {
    field: 'a',
    type: 'nominal',
    title: null,
    header: {
      labelAnchor: 'start',
      labelFontSize: 12,
      labelFontWeight: 400,
      labelPadding: 4,
      labelFont: 'Amsterdam Sans',
    },
    sort: [
      'Heropend',
      'Extern: afgehandeld',
      'Ingepland',
      'Verzoek tot heropenen',
      'Reactie ontvangen',
      'In behandeling',
      'Gesplitst',
      'Reactie gevraagd',
      'Gemeld',
      'Afwachting van behandeling',
      'Extern: verzoek tot afhandeling',
    ],
  },
  spec: {
    width: 280,
    layer: [
      {
        mark: { type: 'bar' },
        encoding: {
          x: { aggregate: 'mean', field: 'b', title: null, axis: null },
        },
      },
      {
        mark: {
          type: 'text',
          align: 'left',
          x: 5,
          color: 'white',
          fontSize: 12,
          fontWeight: 700,
          font: 'Amsterdam Sans',
        },
        encoding: { text: { field: 'b' } },
      },
    ],
  },
  columns: 3,
  config: {
    style: { cell: { stroke: 'transparent' }, bar: { color: '#004699' } },
  },
}
