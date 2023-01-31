// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export const mockData: any = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A simple grid of bar charts to compare performance data.',
  data: {
    values: [
      { a: 'Heropend', b: '18' },
      { a: 'Verzoek tot heropenen', b: '25' },
      { a: 'Gesplitst', b: '32' },
      { a: 'Afwachting van behandeling', b: '40' },
      { a: 'Extern: afgehandeld', b: '54' },
      { a: 'Reactie ontvangen', b: '56' },
      { a: 'Reactie gevraagd', b: '60' },
      { a: 'Extern: verzoek tot afhandeling', b: '64' },
      { a: 'Ingepland', b: '75' },
      { a: 'In behandeling', b: '82' },
      { a: 'Gemeld', b: '103' },
    ],
  },
  width: 160,
  height: { step: 16 },
  spacing: 5,
  mark: 'bar',
  encoding: {
    facet: {
      field: 'a',
      type: 'ordinal',
      columns: 3,
      title: null,
    },
    y: { field: '1', type: 'nominal', axis: null },
    x: {
      field: 'b',
      type: 'quantitative',
      axis: null,
      title: null,
    },
  },
}
