// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Map } from 'leaflet'

import { getZoom } from './utils'
import { DEFAULT_ZOOM } from '../utils'

describe('utils', () => {
  describe('getZoom', () => {
    it('should return the correct value', () => {
      /**
       * The map can be zoomed in to max 16 and zoomed out to max 8.
       * The default zoom is set to 14.
       */

      const mapMockZoomOut = {
        getZoom: jest.fn(() => 16),
      } as unknown as Map

      const result = getZoom(mapMockZoomOut)

      expect(result).toEqual(DEFAULT_ZOOM)

      const mapMockZoomIn = {
        getZoom: jest.fn(() => 10),
      } as unknown as Map

      const secondResult = getZoom(mapMockZoomIn)
      expect(secondResult).toEqual(12)

      const mapMockZoomNull = {
        getZoom: jest.fn(() => DEFAULT_ZOOM),
      } as unknown as Map

      const thirdResult = getZoom(mapMockZoomNull)
      expect(thirdResult).toEqual(14)
    })
  })
})
