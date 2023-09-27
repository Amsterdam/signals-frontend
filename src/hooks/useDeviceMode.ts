// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { sizes } from '@amsterdam/asc-ui/lib/theme/default/breakpoints'

import { DeviceMode } from 'types/device'

function getDeviceMode(size: number) {
  if (size <= sizes.tabletM) {
    return DeviceMode.Mobile
  }
  return DeviceMode.Desktop
}

interface UseDeviceModeReturn {
  deviceMode: DeviceMode
  isDesktop: (mode: DeviceMode) => boolean
  isMobile: (mode: DeviceMode) => boolean
}

export function useDeviceMode(): UseDeviceModeReturn {
  const [deviceMode, setDeviceMode] = useState(getDeviceMode(window.innerWidth))

  const isMobile = useCallback(
    (mode: DeviceMode): mode is DeviceMode.Mobile => mode === DeviceMode.Mobile,
    []
  )

  const isDesktop = useCallback(
    (mode: DeviceMode): mode is DeviceMode.Desktop =>
      mode === DeviceMode.Desktop,
    []
  )

  useEffect(() => {
    const resizeW = () => setDeviceMode(getDeviceMode(window.innerWidth))

    window.addEventListener('resize', resizeW)

    return () => window.removeEventListener('resize', resizeW)
  }, [])

  return { deviceMode, isDesktop, isMobile }
}
