// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export const getAreaChart = (values: Array<unknown>, maxDomain: number) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 440,
  height: 200,
  data: {
    values,
  },
  encoding: {
    x: {
      field: 'a',
      type: 'ordinal',
      title: '',
      timeUnit: 'day',
      axis: { ticks: false, labelAngle: 0, domainColor: 'white', offset: 10 },
    },
    y: {
      field: 'b',
      type: 'quantitative',
      scale: {
        type: 'linear',
        domain: [0, maxDomain],
      },
      title: '',
      axis: {
        grid: false,
        ticks: false,
        domainColor: 'white',
        offset: -15,
      },
    },
  },
  layer: [
    {
      mark: { type: 'area', line: true, point: true },
    },
    {
      mark: {
        type: 'text',
        align: 'center',
        baseline: 'bottom',
        yOffset: -5,
      },
      encoding: {
        text: {
          field: 'b',
        },
      },
    },
  ],
  config: {
    style: {
      area: {
        color: '#FEECEB',
      },
      line: {
        color: '#004699',
        strokeWidth: '1',
      },
      point: {
        color: '#004699',
        size: 70,
      },
      cell: {
        stroke: 'transparent',
      },
    },
  },
})
