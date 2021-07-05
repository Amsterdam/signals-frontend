// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useEffect, useState } from 'react'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { useMapInstance } from '@amsterdam/react-maps'
import {
  MAX_ZOOM_LEVEL,
  MIN_ZOOM_LEVEL,
} from '@amsterdam/arm-core/lib/constants'

export const isLayerVisible = (zoom: number, zoomLevel: ZoomLevel): boolean => {
  const { min, max } = zoomLevel
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL)
}

const useLayerVisible = (zoomLevel: ZoomLevel) => {
  const mapInstance = useMapInstance()

  const [layerVisible, setLayerVisible] = useState(true)

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
