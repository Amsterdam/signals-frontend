// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
export const mockData: any = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A simple grid of bar charts to compare performance data.',
  data: {
    values: [
      { a: { status: 'Heropend', value: 18 }, c: 'column1' },
      { a: { status: 'Verzoek tot heropenen', value: 25 }, c: 'column1' },
      { a: { status: 'Gesplitst', value: 32 }, c: 'column1' },
      { a: { status: 'Afwachting van behandeling', value: 40 }, c: 'column2' },
      { a: { status: 'Extern: afgehandeld', value: 54 }, c: 'column2' },
      { a: { status: 'Reactie ontvangen', value: 56 }, c: 'column2' },
      { a: { status: 'Reactie gevraagd', value: 60 }, c: 'column2' },
      {
        a: { status: 'Extern: verzoek tot afhandeling', value: 64 },
        c: 'column3',
      },
      { a: { status: 'Ingepland', value: 75 }, c: 'column3' },
      { a: { status: 'In behandeling', value: 82 }, c: 'column3' },
      { a: { status: 'Gemeld', value: 103 }, c: 'column3' },
    ],
  },
  mark: {
    type: 'text',
  },
  encoding: 'show us some love',
  mark: 'bar',
  encoding: {
    y: { field: 'a.status', type: 'nominal', title: null },
    x: {
      field: 'a.value',
      type: 'quantitative',
      axis: null,
    },
  },
}
