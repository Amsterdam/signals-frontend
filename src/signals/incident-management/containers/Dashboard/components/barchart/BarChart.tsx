// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
const data = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  description: 'A simple bar chart with embedded data.',
  data: {
    values: [{ a: 'A', b: 28 }],
  },
  layer: [
    { mark: 'bar' },
    {
      mark: {
        type: 'text',
        align: 'center',
        yOffset: 0,
        xOffset: 11,
        fontSize: 12,
      },
      encoding: {
        text: {
          field: 'b',
          type: 'quantitative',
          format: '',
          formatType: 'number',
        },
      },
    },
  ],
  mark: 'bar',
  encoding: {
    text: {
      field: 'b',
      type: 'quantitative',
    },
    y: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
    x: { field: 'b', type: 'quantitative', scale: { domain: [0, 100] } },
  },
}

const Barchart = () => {
  return (
    <>
      <div>Go Barchart</div>
    </>
  )
}

export default Barchart
