// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { mocked } from 'jest-mock'

import reverseGeocoderService from 'shared/services/reverse-geocoder'

import { getAddress } from './utils'
import { mockIncidentsLong } from '../__test__'

jest.mock('shared/services/reverse-geocoder')

describe('utils', () => {
  describe('getAddress', () => {
    const mockLatLng = { lat: 10, lng: 20 }

    const mockAddress = {
      postcode: '1000 AA',
      huisnummer: '100',
      woonplaats: 'Amsterdam',
      openbare_ruimte: 'Damstraat',
    }

    const geocodedResponse = {
      id: 'foo',
      value: 'bar',
      data: {
        location: mockLatLng,
        address: mockAddress,
      },
    }

    it('should return an address based on coordinates', async () => {
      mocked(reverseGeocoderService).mockImplementation(() =>
        Promise.resolve(geocodedResponse)
      )
      const geometry = mockIncidentsLong[0].geometry
      const setAddressMock = jest.fn((address: any) => address)

      await getAddress(geometry, setAddressMock)

      expect(setAddressMock).toHaveBeenCalledWith({
        huisnummer: '100',
        openbare_ruimte: 'Damstraat',
        postcode: '1000 AA',
        woonplaats: 'Amsterdam',
      })
    })
  })
})
