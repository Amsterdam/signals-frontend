// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { sizes } from '@amsterdam/asc-ui/lib/theme/default/breakpoints'

import { featureToCoordinates } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import type { PdokAddress } from 'shared/services/map-location'
import type { Point } from '../../types'
import { DeviceMode } from './types'

export function useDeviceMode(): DeviceMode {
  const [deviceMode, setDeviceMode] = useState(getDeviceMode(window.innerWidth))

  useEffect(() => {
    const resizeW = () => setDeviceMode(getDeviceMode(window.innerWidth))

    window.addEventListener('resize', resizeW)

    return () => window.removeEventListener('resize', resizeW)
  }, [])

  return deviceMode
}

function getDeviceMode(size: number) {
  if (size <= sizes.tabletM) {
    return DeviceMode.Mobile
  } else {
    return DeviceMode.Desktop
  }
}

export const isMobile = (mode: DeviceMode): mode is DeviceMode.Mobile =>
  mode === DeviceMode.Mobile
export const isDesktop = (mode: DeviceMode): mode is DeviceMode.Desktop =>
  mode === DeviceMode.Desktop

export const getAddress = (
  geometry: Point,
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
