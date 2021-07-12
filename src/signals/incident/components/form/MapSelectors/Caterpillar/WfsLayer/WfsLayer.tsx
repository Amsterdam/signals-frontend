// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import {
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  cloneElement,
  useCallback,
} from 'react'
import type { FunctionComponent } from 'react'
import { useMapInstance } from '@amsterdam/react-maps'
import { fetchWithAbort } from '@amsterdam/arm-core'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import type { FeatureCollection } from 'geojson'
import type { DataLayerProps } from 'signals/incident/components/form/MapSelectors/types'

import { DEFAULT_ZOOM } from 'components/AreaMap/AreaMap'
import useLayerVisible from '../../hooks/useLayerVisible'
import {
  INITIAL_STATE,
  WfsDataProvider,
} from '../../components/DataContext/context'
import SelectContext from '../context/context'

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

  const getBounds = useCallback(() => {
    const zoomLevel = mapInstance.getZoom()

    return mapInstance.getBounds().pad(zoomLevel >= DEFAULT_ZOOM ? 1 : 0)
  }, [mapInstance])

  const [bounds, setBounds] = useState(getBounds())

  const requestUrl = useMemo(() => {
    return url
      .replace('{east}', bounds.getEast().toString())
      .replace('{west}', bounds.getWest().toString())
      .replace('{north}', bounds.getNorth().toString())
      .replace('{south}', bounds.getSouth().toString())
  }, [bounds, url])

  const [data, setData] = useState<FeatureCollection>(INITIAL_STATE)

  /* istanbul ignore next */
  useEffect(() => {
    setBounds(getBounds())

    function onMoveEnd() {
      setBounds(getBounds())
    }

    mapInstance.on('moveend', onMoveEnd)

    return () => {
      mapInstance.off('moveend', onMoveEnd)
    }
  }, [getBounds, mapInstance])

  useEffect(() => {
    setMessage(undefined)
    if (!layerVisible) {
      setData(INITIAL_STATE)
      return
    }

    const [request, controller] = fetchWithAbort(`${requestUrl}`)

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
  }, [url, layerVisible, setMessage, requestUrl])

  const layer = cloneElement(children, {
    featureTypes: meta.featureTypes,
  })
  return <WfsDataProvider value={data}>{layer}</WfsDataProvider>
}

export default WfsLayer
