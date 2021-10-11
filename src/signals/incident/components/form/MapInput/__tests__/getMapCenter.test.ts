import configuration from 'shared/services/configuration/configuration'

import getMapCenter from '../getMapCenter'

const WITHIN_BOUNDS = [52.3568, 4.8643]
const setHref = (href: string) => {
  jest.spyOn(window, 'location', 'get').mockReturnValue({
    ...window.location,
    ...{
      href,
    },
  })
}

describe('getMapCenter', () => {
  it('should return configured center by default', () => {
    setHref(`https://example.com`)

    expect(getMapCenter()).toEqual(configuration.map.options.center)
  })

  it('should handle URL query parameters', () => {
    setHref(
      `https://example.com?lat=${WITHIN_BOUNDS[0]}&lng=${WITHIN_BOUNDS[1]}`
    )

    expect(getMapCenter()).toEqual(WITHIN_BOUNDS)
  })

  it('should handle invalid input', () => {
    const lat = WITHIN_BOUNDS[0]
    const lng = WITHIN_BOUNDS[0]
    const invalidCoordinates = [
      // Out of bounds
      [0, 0],
      [0, lng],
      [lat, 0],
      [1000, 1000],
      // Missing input
      [lat],
      [undefined, lng],
      // Invalid input
      ['foo', lng],
      [lat, 'bar'],
    ]

    invalidCoordinates.forEach((coordinates) => {
      setHref(`https://example.com?lat=${coordinates[0]}&lng=${coordinates[1]}`)

      expect(getMapCenter()).toEqual(configuration.map.options.center)
    })
  })
})
