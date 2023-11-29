// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { LatLngTuple } from 'leaflet'

import PDOKResponseJson from 'utils/__tests__/fixtures/PDOKResponseData.json'

import {
  featureToCoordinates,
  formatMapLocation,
  formatPDOKResponse,
  coordinatesToAPIFeature,
  coordinatesToFeature,
  pointWithinBounds,
  serviceResultToAddress,
  wktPointToLocation,
} from '.'

const testAddress = {
  openbare_ruimte: 'Keizersgracht',
  huisnummer: 666,
  huisletter: 'D',
  huisnummer_toevoeging: 3,
  postcode: '1016EJ',
  woonplaats: 'Amsterdam',
}

const coordinates = { lng: 4, lat: 52 }
const coordinatesWithLngAlphabeticallyBigger = { lng: 6, lat: 52 }

const testFeature = {
  type: 'Point',
  coordinates: [coordinates.lat, coordinates.lng] as LatLngTuple,
}

const testFeatureWithLngAlphabeticallyBigger = {
  type: 'Point',
  coordinates: [
    coordinatesWithLngAlphabeticallyBigger.lat,
    coordinatesWithLngAlphabeticallyBigger.lng,
  ] as LatLngTuple,
}

const apiCompatibleFeature = {
  type: 'Point',
  coordinates: [coordinates.lng, coordinates.lat] as LatLngTuple,
}

describe('coordinatesToFeature', () => {
  it('should convert', () => {
    expect(coordinatesToFeature(coordinates)).toEqual(testFeature)
  })

  it('should work with lat and lng swapped around', () => {
    expect(
      coordinatesToFeature({ lng: coordinates.lat, lat: coordinates.lng })
    ).toEqual(testFeature)
  })

  it('should work when the lng is alphabetically bigger than the lat', () => {
    expect(
      coordinatesToFeature(coordinatesWithLngAlphabeticallyBigger)
    ).toEqual(testFeatureWithLngAlphabeticallyBigger)
  })
})

describe('coordinatesToAPIFeature', () => {
  it('should convert', () => {
    expect(coordinatesToAPIFeature(coordinates)).toEqual(apiCompatibleFeature)
  })
})

describe('featureToCoordinates', () => {
  it('should convert', () => {
    expect(featureToCoordinates(testFeature)).toEqual(coordinates)
  })

  it('should work with lat and lng swapped around', () => {
    expect(
      featureToCoordinates({
        ...testFeature,
        coordinates: [coordinates.lat, coordinates.lng],
      })
    ).toEqual(coordinates)
  })

  it('should work when the lng is alphabetically bigger than the lat', () => {
    expect(
      featureToCoordinates(testFeatureWithLngAlphabeticallyBigger)
    ).toEqual(coordinatesWithLngAlphabeticallyBigger)
  })
})

describe('wktPointToLocation', () => {
  it('should convert a WKT point to latlon location with comma or space as separation', () => {
    expect(wktPointToLocation('POINT(4.90225668 52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })

    expect(wktPointToLocation('POINT(4.90225668,52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })
  })

  it('should work when the lng is alphabetically bigger than the lat', () => {
    expect(wktPointToLocation('POINT(6.90225668 52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 6.90225668,
    })

    expect(wktPointToLocation('POINT(6.90225668,52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 6.90225668,
    })
  })

  it('should use the smallest number of the two as longitude, expecting to be in the area of north west Europe', () => {
    expect(wktPointToLocation('POINT(52.36150435 6.90225668)')).toEqual({
      lat: 52.36150435,
      lng: 6.90225668,
    })

    expect(wktPointToLocation('POINT(52.36150435,4.90225668)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })
  })

  it('should throw an error', () => {
    expect(() => {
      wktPointToLocation('POLYGON(4.90225668 52.36150435)')
    }).toThrow()

    expect(() => {
      wktPointToLocation('POINT(4.90225668)')
    }).toThrow()
  })
})

describe('formatMapLocation', () => {
  it('should convert the sia location to map format location ', () => {
    const result = {
      coordinates: { lat: 52, lng: 4 },
      addressText: 'Keizersgracht 666D-3, 1016EJ Amsterdam',
      address: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: 666,
        huisletter: 'D',
        huisnummer_toevoeging: 3,
        postcode: '1016EJ',
        woonplaats: 'Amsterdam',
      },
    }

    const location = {
      stadsdeel: 'west',
      buurt_code: null,
      extra_properties: null,
      geometrie: { type: 'Point', coordinates: [52, 4] as LatLngTuple },
      address: testAddress,
    }

    expect(formatMapLocation(location)).toEqual(result)
  })

  it('should disregard empty values', () => {
    const location = {
      stadsdeel: 'west',
      buurt_code: null,
      extra_properties: null,
      geometrie: testFeature,
      address: null,
    }

    const result = {
      coordinates: { lat: 52, lng: 4 },
      addressText: '',
      address: undefined,
    }

    expect(formatMapLocation(location)).toStrictEqual(result)
  })

  it('returns an empty object when param is falsy', () => {
    const location = null

    expect(formatMapLocation(location)).toStrictEqual({})
  })
})

describe('serviceResultToAddress', () => {
  it('should convert PDOK address result sia format ', () => {
    const data = {
      woonplaatsnaam: 'Amsterdam',
      huis_nlt: '43G',
      weergavenaam: 'Achtergracht 43G, 1017WN Amsterdam',
      straatnaam: 'Achtergracht',
      id: 'adr-e26dbf16d329474aa79276d93db9bebd',
      postcode: '1017WN',
      centroide_ll: 'POINT(4.90225668 52.36150435)',
    }
    expect(serviceResultToAddress(data)).toEqual({
      openbare_ruimte: 'Achtergracht',
      huisnummer: '43G',
      postcode: '1017WN',
      woonplaats: 'Amsterdam',
    })
  })
})

describe('formatPDOKResponse', () => {
  it('should convert PDOK response to address list ', () => {
    const data = PDOKResponseJson
    expect(formatPDOKResponse(data)).toEqual([
      {
        id: 'adr-7e22b4ee3640202eff3203e63610c76e',
        value: 'Achtergracht 43, 1017WN Amsterdam',
        data: {
          location: { lat: 52.36163457, lng: 4.90218585 },
          address: {
            openbare_ruimte: 'Achtergracht',
            huisnummer: '43',
            postcode: '1017WN',
            woonplaats: 'Amsterdam',
          },
        },
      },
      {
        id: 'adr-e26dbf16d329474aa79276d93db9bebd',
        value: 'Achtergracht 43G, 1017WN Amsterdam',
        data: {
          location: { lat: 52.36150435, lng: 4.90225668 },
          address: {
            openbare_ruimte: 'Achtergracht',
            huisnummer: '43G',
            postcode: '1017WN',
            woonplaats: 'Amsterdam',
          },
        },
      },
    ])
  })

  it('return an empty array', () => {
    expect(formatPDOKResponse(undefined)).toEqual([])
    expect(formatPDOKResponse(null)).toEqual([])
  })

  it('returns an list with unique streetNames when streetNameOnly is true', () => {
    const data = PDOKResponseJson
    const streetNameOnly = true
    expect(formatPDOKResponse(data, streetNameOnly)).toEqual([
      {
        id: 'adr-e26dbf16d329474aa79276d93db9bebd',
        value: 'Achtergracht',
        data: {
          location: { lat: 52.36150435, lng: 4.90225668 },
          address: {
            openbare_ruimte: 'Achtergracht',
            huisnummer: '43G',
            postcode: '1017WN',
            woonplaats: 'Amsterdam',
          },
        },
      },
    ])
  })
})

describe('pointWithinBounds', () => {
  it('returns a boolean', () => {
    const minLat = 2
    const maxLat = 7

    const minLng = 2
    const maxLng = 9

    const bounds = [
      [minLat, minLng],
      [maxLat, maxLng],
    ]

    const middle: LatLngTuple = [5, 6]
    const outsideLeft: LatLngTuple = [1, 6]
    const outsideRight: LatLngTuple = [5, 10]
    const outsideTop: LatLngTuple = [5, 1]
    const outsideBottom: LatLngTuple = [5, 10]

    expect(pointWithinBounds(middle, bounds)).toEqual(true)
    expect(pointWithinBounds(outsideLeft, bounds)).toEqual(false)
    expect(pointWithinBounds(outsideRight, bounds)).toEqual(false)
    expect(pointWithinBounds(outsideTop, bounds)).toEqual(false)
    expect(pointWithinBounds(outsideBottom, bounds)).toEqual(false)
  })

  it('works with lat and lng swapped', () => {
    const minLat = 2
    const maxLat = 9

    const minLng = 4
    const maxLng = 7

    const bounds = [
      [minLat, minLng],
      [maxLat, maxLng],
    ]

    const middle: LatLngTuple = [8, 6]
    const swapped: LatLngTuple = [6, 8]
    const outside: LatLngTuple = [3, 6]

    expect(pointWithinBounds(middle, bounds)).toEqual(true)
    expect(pointWithinBounds(swapped, bounds)).toEqual(true)
    expect(pointWithinBounds(outside, bounds)).toEqual(false)
  })

  it('works when the lng is alphabetically bigger than the lat', () => {
    const minLat = 2
    const maxLat = 12

    const minLng = 4
    const maxLng = 7

    const bounds = [
      [minLat, minLng],
      [maxLat, maxLng],
    ]

    const middle: LatLngTuple = [11, 6]

    expect(pointWithinBounds(middle, bounds)).toEqual(true)
  })
})
