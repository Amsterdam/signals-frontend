// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { featureToCoordinates } from 'shared/services/map-location'
import type { PdokAddress } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'

import type { PointLatLng } from '../../types'

export const getAddress = (
  geometry: PointLatLng,
  setAddress: (address: PdokAddress) => void
) => {
  const coordinates = featureToCoordinates(geometry)
  const mapCoordinatesToAddress = async () => {
    const response = await reverseGeocoderService(coordinates)

    if (response?.data?.address) {
      setAddress(response.data.address)
    }
  }

  mapCoordinatesToAddress()
}
