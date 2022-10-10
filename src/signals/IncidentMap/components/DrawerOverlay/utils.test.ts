// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { renderHook } from '@testing-library/react-hooks'
import { mocked } from 'jest-mock'

import reverseGeocoderService from 'shared/services/reverse-geocoder'

import { resizeWindow, mockIncidents } from '../__test__'
import { getAddress } from './utils'
import {useDeviceMode} from "../utils/get-device-mode";

jest.mock('shared/services/reverse-geocoder')

describe('utils', () => {
  describe('useDeviceMode', () => {
    it('should give the correct deviceMode {Desktop)', () => {
      const { result } = renderHook(() => useDeviceMode())

      expect(result.current).toEqual('DESKTOP')
    })

    it('should give the correct deviceMode (Mobile)', () => {
      resizeWindow(400, 1200)
      const { result } = renderHook(() => useDeviceMode())

      expect(result.current).toEqual('MOBILE')
    })
  })

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
      const geometry = mockIncidents[0].geometry
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
