// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getBarChartSpecs } from './getBarChartSpecs'
import type { BarChartValue } from '../charts/types'

const mockData: BarChartValue[] = [
  {
    status: 'Heropend',
    nrOfIncidents: 81,
  },
  {
    status: 'Extern: afgehandeld',
    nrOfIncidents: 131,
  },
  {
    status: 'Ingepland',
    nrOfIncidents: 132,
  },
  {
    status: 'Verzoek tot heropenen',
    nrOfIncidents: 78,
  },
  {
    status: 'Reactie ontvangen',
    nrOfIncidents: 57,
  },
  {
    status: 'In behandeling',
    nrOfIncidents: 559,
  },
  {
    status: 'Gesplitst',
    nrOfIncidents: 387,
  },
  {
    status: 'Reactie gevraagd',
    nrOfIncidents: 0,
  },
  {
    status: 'Gemeld',
    nrOfIncidents: 6513,
  },
  {
    status: 'Afwachting van behandeling',
    nrOfIncidents: 1948,
  },
  {
    status: 'Extern: verzoek tot afhandeling',
    nrOfIncidents: 75,
  },
]

const maxDomain = 6513

describe('getAreaChartSpec', () => {
  it('should return correct object', () => {
    const result = getBarChartSpecs(mockData, maxDomain)

    expect(result).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "columns": 3,
        "config": Object {
          "style": Object {
            "bar": Object {
              "color": "#004699",
              "opacity": 0.5,
              "size": 27,
            },
            "cell": Object {
              "stroke": "transparent",
            },
            "rule": Object {
              "color": "#004699",
            },
          },
        },
        "data": Object {
          "values": Array [
            Object {
              "nrOfIncidents": 81,
              "status": "Heropend",
            },
            Object {
              "nrOfIncidents": 131,
              "status": "Extern: afgehandeld",
            },
            Object {
              "nrOfIncidents": 132,
              "status": "Ingepland",
            },
            Object {
              "nrOfIncidents": 78,
              "status": "Verzoek tot heropenen",
            },
            Object {
              "nrOfIncidents": 57,
              "status": "Reactie ontvangen",
            },
            Object {
              "nrOfIncidents": 559,
              "status": "In behandeling",
            },
            Object {
              "nrOfIncidents": 387,
              "status": "Gesplitst",
            },
            Object {
              "nrOfIncidents": 0,
              "status": "Reactie gevraagd",
            },
            Object {
              "nrOfIncidents": 6513,
              "status": "Gemeld",
            },
            Object {
              "nrOfIncidents": 1948,
              "status": "Afwachting van behandeling",
            },
            Object {
              "nrOfIncidents": 75,
              "status": "Extern: verzoek tot afhandeling",
            },
          ],
        },
        "description": "A bar chart showing showing number of incidents per status",
        "facet": Object {
          "field": "status",
          "header": Object {
            "labelAnchor": "start",
            "labelFont": "Amsterdam Sans",
            "labelFontSize": 14,
            "labelFontWeight": 400,
            "labelPadding": 4,
          },
          "sort": null,
          "title": null,
        },
        "spacing": 5,
        "spec": Object {
          "layer": Array [
            Object {
              "encoding": Object {
                "x": Object {
                  "aggregate": "sum",
                  "axis": null,
                  "field": "nrOfIncidents",
                  "scale": Object {
                    "domain": Array [
                      0,
                      6513,
                    ],
                    "rangeMax": 275,
                  },
                  "title": null,
                },
              },
              "mark": Object {
                "type": "bar",
                "xOffset": 4,
              },
            },
            Object {
              "encoding": Object {
                "size": Object {
                  "value": 4,
                },
                "x": Object {
                  "aggregate": "sum",
                  "field": "nrOfIncidents",
                },
                "y": Object {
                  "value": 22,
                },
              },
              "mark": Object {
                "type": "rule",
                "xOffset": 4,
              },
            },
            Object {
              "encoding": Object {
                "text": Object {
                  "field": "nrOfIncidents",
                  "type": "quantitative",
                },
              },
              "mark": Object {
                "align": "left",
                "font": "Amsterdam Sans",
                "fontSize": 14,
                "fontWeight": 700,
                "type": "text",
                "x": 8,
              },
            },
          ],
        },
      }
    `)
  })
})
