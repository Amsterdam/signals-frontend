import { useEffect, useState } from 'react'

import { useMapInstance } from '@amsterdam/react-maps'
import type { Map } from 'leaflet'

export type Bbox = {
  east: string
  north: string
  south: string
  west: string
}

const getBbox = (mapInstance: Map): Bbox => {
  const bounds = mapInstance.getBounds()

  return {
    east: bounds.getEast().toString(),
    north: bounds.getNorth().toString(),
    south: bounds.getSouth().toString(),
    west: bounds.getWest().toString(),
  }
}

const useBoundingBox = (): Bbox | undefined => {
  const mapInstance = useMapInstance()
  const [bbox, setBoundingBox] = useState<Bbox>()

  useEffect(() => {
    setBoundingBox(getBbox(mapInstance))

    const onMoveEnd = () => {
      setBoundingBox(getBbox(mapInstance))
    }

    mapInstance.on('moveend', onMoveEnd)

    return () => {
      mapInstance.off('moveend', onMoveEnd)
    }
  }, [mapInstance])

  return bbox
}

export default useBoundingBox
