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
import type { DataLayerProps } from 'signals/incident/components/form/MapSelectors/types'
import type { Map as MapType } from 'leaflet'

import useLayerVisible from '../../hooks/useLayerVisible'
import {
  INITIAL_STATE,
  WfsDataProvider,
} from '../../components/DataContext/context'
import SelectContext from '../context/context'

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
  const { meta, setMessage } = useContext(SelectContext)
  const url = meta.endpoint
  const layerVisible = useLayerVisible(zoomLevel)

  const getBbox = (map: MapType): string => {
    const bounds = map.getBounds()

    return `<BBOX><PropertyName>geometrie</PropertyName><gml:Envelope srsName="${SRS_NAME}"><lowerCorner>${bounds.getWest()} ${bounds.getSouth()}</lowerCorner><upperCorner>${bounds.getEast()} ${bounds.getNorth()}</upperCorner></gml:Envelope></BBOX>`
  }

  const [bbox, setBbox] = useState('')
  const [data, setData] = useState<FeatureCollection>(INITIAL_STATE)
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
      // TODO uncomment
      // setBbox(getBbox(mapInstance))
    }

    mapInstance.on('moveend', onMoveEnd)

    return () => {
      mapInstance.off('moveend', onMoveEnd)
    }
  }, [mapInstance])

  useEffect(() => {
    setMessage(undefined)
    if (!layerVisible) {
      setData(INITIAL_STATE)
      return
    }

    if (!bbox) return

    const [request, controller] = fetchWithAbort(`${url}${wfsFilter}`)

    request
      .then(async (result) => result.json())
      .then((result) => {
        // TODO remove - result set is too large to render (10.000 items)
        // spliced set contains reported trees in Vondelpark
        ;(result.features as []).splice(0, 8000).splice(750, 1250)
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
