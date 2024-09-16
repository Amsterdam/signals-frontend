// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import fetchMock from 'jest-fetch-mock'

import reverseGeocoderService, {
  formatRequest,
  serviceURL,
} from './reverse-geocoder'

describe('formatRequest', () => {
  const testLocation = {
    lat: 42,
    lng: 4,
  }
  const result =
    'https://base-url/&X=39180.476027290264&Y=-667797.6751788945&distance='

  it('should format correct without distance', () => {
    expect(formatRequest('https://base-url', testLocation)).toEqual(
      `${result}30`
    )
  })

  it('should format correct with distance', () => {
    expect(formatRequest('https://base-url', testLocation, 20)).toEqual(
      `${result}20`
    )
  })
})

describe('reverseGeocoderService', () => {
  const testLocation = {
    lat: 42,
    lng: 4,
  }

  const serviceURLResponse = {
    response: {
      numFound: 1,
      start: 0,
      maxScore: 15.822564,
      docs: [
        {
          woonplaatsnaam: 'Amsterdam',
          huis_nlt: '189A-2',
          weergavenaam: 'Bloemgracht 189A-2, 1016KP Amsterdam',
          straatnaam: 'Bloemgracht',
          id: 'adr-a03ce477aaa2e95e9246139b631484ad',
          postcode: '1016KP',
          centroide_ll: 'POINT(4.87745608 52.37377195)',
        },
      ],
    },
  }

  const testResult = {
    id: serviceURLResponse.response.docs[0].id,
    value: serviceURLResponse.response.docs[0].weergavenaam,
    data: {
      location: { lat: 52.37377195, lng: 4.87745608 },
      address: {
        openbare_ruimte: serviceURLResponse.response.docs[0].straatnaam,
        huisnummer: serviceURLResponse.response.docs[0].huis_nlt,
        postcode: serviceURLResponse.response.docs[0].postcode,
        woonplaats: serviceURLResponse.response.docs[0].woonplaatsnaam,
      },
    },
  }

  it('should return a value from a response without a location', async () => {
    const noneFoundResponse = {
      response: {
        numFound: 0,
        start: 0,
        maxScore: 0.0,
        docs: [],
      },
    }
    fetchMock.mockResponse(JSON.stringify(noneFoundResponse))

    const result = await reverseGeocoderService(testLocation)

    expect(result).toBeUndefined()
  })

  // TODO: this test broke when updating MSW, should be fixed
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return the correct location', async () => {
    fetchMock.resetMocks()
    fetchMock.mockResponseOnce(JSON.stringify(serviceURLResponse))

    const result = await reverseGeocoderService(testLocation)

    expect(fetch).toHaveBeenCalledTimes(1)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining(serviceURL))

    expect(result).toEqual(testResult)
  })

  it('should handle failed requests', async () => {
    fetchMock.mockReject(() =>
      Promise.reject(new Error('something bad happened'))
    )

    const result = await reverseGeocoderService(testLocation)

    expect(result).toBeUndefined()
  })
})
