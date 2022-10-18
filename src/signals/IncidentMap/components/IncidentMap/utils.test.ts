import type { Map } from 'leaflet'

import { getZoom } from './utils'

describe('utils', () => {
  describe('getZoom', () => {
    it('should return the correct value', () => {
      const mapMockZoomOut = {
        getZoom: jest.fn(() => 18),
      } as unknown as Map

      const result = getZoom(mapMockZoomOut)

      expect(result).toEqual(14)

      const mapMockZoomIn = {
        getZoom: jest.fn(() => 10),
      } as unknown as Map

      const secondResult = getZoom(mapMockZoomIn)
      expect(secondResult).toEqual(12)

      const mapMockZoomNull = {
        getZoom: jest.fn(() => 14),
      } as unknown as Map

      const thirdResult = getZoom(mapMockZoomNull)
      expect(thirdResult).toEqual(14)
    })
  })
})
