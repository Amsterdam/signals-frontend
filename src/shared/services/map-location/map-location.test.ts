// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PDOKResponseJson from 'utils/__tests__/fixtures/PDOKResponseData.json'
import {
  mapLocation,
  featureTolocation,
  locationTofeature,
  wktPointToLocation,
  formatMapLocation,
  serviceResultToAddress,
  formatPDOKResponse,
  pointWithinBounds,
} from '.'

const testAddress = {
  openbare_ruimte: 'Keizersgracht',
  huisnummer: 666,
  huisletter: 'D',
  huisnummer_toevoeging: 3,
  postcode: '1016EJ',
  woonplaats: 'Amsterdam',
}

const testLocation = { lng: 4, lat: 52 }

const testFeature = {
  type: 'Point',
  coordinates: [4, 52],
}

describe('locationToFeature', () => {
  it('should convert', () => {
    expect(locationTofeature(testLocation)).toEqual(testFeature)
  })
})

describe('featureTolocation', () => {
  it('should convert', () => {
    expect(featureTolocation(testFeature)).toEqual(testLocation)
  })
})

describe('mapLocation', () => {
  it('should map geometry', () => {
    expect(
      mapLocation({
        geometrie: {
          type: 'Point',
          coordinates: [4, 52],
        },
        address: {
          openbare_ruimte: 'Keizersgracht',
          huisnummer: '666',
          huisletter: 'D',
          huisnummer_toevoeging: '3',
          postcode: '1016EJ',
          woonplaats: 'Amsterdam',
        },
      })
    ).toEqual({
      geometrie: {
        type: 'Point',
        coordinates: [4, 52],
      },
      address: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: '666',
        huisletter: 'D',
        huisnummer_toevoeging: '3',
        postcode: '1016EJ',
        woonplaats: 'Amsterdam',
      },
    })
  })
})

describe('wktPointToLocation', () => {
  it('should convert a WKT point to latlon location ', () => {
    expect(wktPointToLocation('POINT(4.90225668 52.36150435)')).toEqual({
      lat: 52.36150435,
      lng: 4.90225668,
    })
  })

  it('should throw an error', () => {
    expect(() => {
      wktPointToLocation('POLYGON(4.90225668 52.36150435)')
    }).toThrow()
  })
})

describe('formatMapLocation', () => {
  it('should convert the sia location to map format location ', () => {
    const loc = {
      geometrie: testFeature,
      address: testAddress,
    }

    const result = {
      location: { lat: 52, lng: 4 },
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

    expect(formatMapLocation(loc)).toEqual(result)
  })

  it('should disregard empty values', () => {
    const location = {
      geometrie: testFeature,
      address: {
        openbare_ruimte: 'Keizersgracht',
        huisnummer: 666,
        huisletter: '',
        huisnummer_toevoeging: undefined,
        postcode: '',
        woonplaats: 'Amsterdam',
      },
    }

    const result = {
      location: { lat: 52, lng: 4 },
      addressText: 'Keizersgracht 666, Amsterdam',
      address: location.address,
    }

    expect(formatMapLocation(location)).toEqual(result)
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

    const middle = [5, 6]
    const outsideLeft = [1, 6]
    const outsideRight = [5, 10]
    const outsideTop = [5, 1]
    const outsideBottom = [5, 10]

    expect(pointWithinBounds(middle, bounds)).toEqual(true)
    expect(pointWithinBounds(outsideLeft, bounds)).toEqual(false)
    expect(pointWithinBounds(outsideRight, bounds)).toEqual(false)
    expect(pointWithinBounds(outsideTop, bounds)).toEqual(false)
    expect(pointWithinBounds(outsideBottom, bounds)).toEqual(false)
  })
})
