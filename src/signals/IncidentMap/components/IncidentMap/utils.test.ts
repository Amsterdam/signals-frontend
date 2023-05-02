// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Map } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'

import { getFlyToZoom } from './utils'

describe('utils', () => {
  describe('getFlyToZoom', () => {
    it('should return the correct value', () => {
      /**
       * The map can be zoomed in to max 16 and zoomed out to max 8.
       * The default zoom is set to 14.
       */

      const mapMockZoomIn = {
        getZoom: jest.fn(() => 16),
      } as unknown as Map

      const result = getFlyToZoom(mapMockZoomIn)

      expect(result).toEqual(configuration.map.optionsIncidentMap.flyToMaxZoom)

      const mapMockZoomOut = {
        getZoom: jest.fn(() => 10),
      } as unknown as Map

      const secondResult = getFlyToZoom(mapMockZoomOut)
      expect(secondResult).toEqual(
        configuration.map.optionsIncidentMap.flyToMinZoom
      )

      const mapMockZoomNull = {
        getZoom: jest.fn(() => 14),
      } as unknown as Map

      const thirdResult = getFlyToZoom(mapMockZoomNull)
      expect(thirdResult).toEqual(14)
    })
  })
})
