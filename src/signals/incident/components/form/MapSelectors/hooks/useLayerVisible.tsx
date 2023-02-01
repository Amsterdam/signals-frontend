// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import {
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@amsterdam/arm-core/lib/constants'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { useMapInstance } from '@amsterdam/react-maps'

export const isLayerVisible = (zoom: number, zoomLevel: ZoomLevel): boolean => {
  const { min, max } = zoomLevel
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL)
}

const useLayerVisible = (zoomLevel: ZoomLevel) => {
  const mapInstance = useMapInstance()

  const isVisible = isLayerVisible(mapInstance.getZoom(), zoomLevel)
  const [layerVisible, setLayerVisible] = useState(isVisible)

  useEffect(() => {
    /* istanbul ignore next */
    if (!mapInstance) return

    function onZoomEnd() {
      setLayerVisible(isLayerVisible(mapInstance.getZoom(), zoomLevel))
    }

    mapInstance.on('zoomend', onZoomEnd)

    return () => {
      mapInstance.off('zoomend', onZoomEnd)
    }
  }, [mapInstance, setLayerVisible, zoomLevel])

  return layerVisible
}

export default useLayerVisible
