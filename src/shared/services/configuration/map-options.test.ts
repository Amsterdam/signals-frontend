// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

jest.mock('shared/services/configuration/configuration')

describe('shared/services/configuration/map-options', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return an object with configuration props', () => {
    configuration.map.options = {
      maxNumberOfAssets: {
        afvalContainer: 1,
        eikenProcessierups: 1,
        klokken: 1,
        straatverlichting: 1,
      },
      crs: 'EPSG:28992',
      zoom: 1,
      center: [2],
      maxBounds: [[3]],
      maxZoom: 4,
      minZoom: 5,
    }

    // eslint-disable-next-line
    const mapOptions = require('./map-options').default

    expect(mapOptions).toEqual(
      expect.objectContaining({
        zoomControl: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        crs: expect.objectContaining({}),
        attributionControl: true,
        dragging: true,
      })
    )
  })
})
