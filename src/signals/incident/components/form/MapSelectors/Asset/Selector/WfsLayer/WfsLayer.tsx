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
  const url = meta.endpoint
  const layerVisible = useLayerVisible(zoomLevel)

  const getBbox = (map: MapType): string => {
    const bounds = map.getBounds()

    return `<BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="${SRS_NAME}"><lowerCorner>${bounds.getWest()} ${bounds.getSouth()}</lowerCorner><upperCorner>${bounds.getEast()} ${bounds.getNorth()}</upperCorner></gml:Envelope></BBOX>`
  }

  const [bbox, setBbox] = useState('')
  const [data, setData] = useState<FeatureCollection>(NO_DATA)

  const wfsFilter = useMemo<string>(
    () =>
      `&Filter=<Filter>${
        meta.wfsFilter ? `<And>${meta.wfsFilter}${bbox}</And>` : bbox
      }</Filter>`,
    [meta.wfsFilter, bbox]
  )

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

    const [request, controller] = fetchWithAbort(`${url}${wfsFilter}`)

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
        console.error('Unhandled Error in wfs call', JSON.stringify(error))
        setMessage('Kaart informatie kon niet worden opgehaald.')
      })

    return () => {
      controller.abort()
    }
  }, [bbox, url, layerVisible, setMessage, wfsFilter])

  const layer = cloneElement(children, {
    featureTypes: meta.featureTypes,
  })
  return <WfsDataProvider value={data}>{layer}</WfsDataProvider>
}

export default WfsLayer
