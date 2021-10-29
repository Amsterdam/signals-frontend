// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import {
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  cloneElement,
} from 'react'
import type { FunctionComponent } from 'react'
import { useMapInstance } from '@amsterdam/react-maps'
import { fetchWithAbort } from '@amsterdam/arm-core'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import type { FeatureCollection } from 'geojson'
import type { Map as MapType } from 'leaflet'

import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import useLayerVisible from '../../../hooks/useLayerVisible'
import type { DataLayerProps } from '../../../types'
import { NO_DATA, WfsDataProvider } from './context'

const SRS_NAME = 'urn:ogc:def:crs:EPSG::4326'

interface Bbox {
  east: string
  north: string
  south: string
  west: string
}

export interface WfsLayerProps {
  children: ReactElement<DataLayerProps>
  zoomLevel?: ZoomLevel
}

const WfsLayer: FunctionComponent<WfsLayerProps> = ({
  children,
  zoomLevel = {},
}) => {
  const mapInstance = useMapInstance()
  const { meta, setMessage } = useContext(AssetSelectContext)
  const layerVisible = useLayerVisible(zoomLevel)

  const getBbox = (map: MapType): Bbox => {
    const bounds = map.getBounds()

    return {
      east: bounds.getEast().toString(),
      north: bounds.getNorth().toString(),
      south: bounds.getSouth().toString(),
      west: bounds.getWest().toString(),
    }
  }

  const [bbox, setBbox] = useState<Bbox>()
  const [data, setData] = useState<FeatureCollection>(NO_DATA)

  const wfsUrl = useMemo<string>(() => {
    const endpoint = meta?.endpoint
    const urlReplacements = endpoint &&
      bbox && {
        ...bbox,
        srsName: SRS_NAME,
      }
    return urlReplacements
      ? Object.entries(urlReplacements).reduce(
          (acc, [key, replacement]) =>
            acc.replace(new RegExp(`{${key}}`, 'g'), replacement),
          endpoint
        )
      : ''
  }, [meta.endpoint, bbox])

  /* istanbul ignore next */
  useEffect(() => {
    setBbox(getBbox(mapInstance))

    function onMoveEnd() {
      setBbox(getBbox(mapInstance))
    }

    mapInstance.on('moveend', onMoveEnd)

    return () => {
      mapInstance.off('moveend', onMoveEnd)
    }
  }, [mapInstance])

  useEffect(() => {
    setMessage(undefined)
    if (!layerVisible) {
      setData(NO_DATA)
      return
    }

    if (!bbox) return

    const [request, controller] = fetchWithAbort(wfsUrl)

    request
      .then(async (result) => result.json())
      .then((result) => {
        setData(result)
        return null
      })
      .catch((error) => {
        // Ignore abort errors since they are expected to happen.
        if (error instanceof Error && error.name === 'AbortError') {
          // eslint-disable-next-line promise/no-return-wrap
          return
        }

        // eslint-disable-next-line no-console
        console.error('Unhandled Error in wfs call', error.message)
        setMessage('Kaart informatie kon niet worden opgehaald.')
      })

    return () => {
      controller.abort()
    }
  }, [bbox, wfsUrl, layerVisible, setMessage])

  const layer = cloneElement(children, {
    featureTypes: meta.featureTypes,
  })
  return <WfsDataProvider value={data}>{layer}</WfsDataProvider>
}

export default WfsLayer
