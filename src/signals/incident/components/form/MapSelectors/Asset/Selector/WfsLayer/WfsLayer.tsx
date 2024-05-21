// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import { useContext, useEffect, useState } from 'react'
import type { FunctionComponent, ReactElement } from 'react'

import { fetchWithAbort } from '@amsterdam/arm-core'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import type { FeatureCollection } from 'geojson'

import configuration from 'shared/services/configuration/configuration'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import type { DataLayerProps } from 'signals/incident/components/form/MapSelectors/types'

import { NO_DATA, WfsDataProvider } from './context'
import { isCaterpillarCategory } from './utils/is-caterpillar-category'
import { mapCaterpillarFeatures } from './utils/map-caterpillar-features'
import { mapDataToSelectableFeature } from './utils/map-data-to-selectable-feature'
import useBoundingBox from '../../../hooks/useBoundingBox'
import useLayerVisible from '../../../hooks/useLayerVisible'

export const SRS_NAME = 'EPSG:4326'

export interface WfsLayerProps {
  children: ReactElement<DataLayerProps>
  zoomLevel?: ZoomLevel
}

const WfsLayer: FunctionComponent<WfsLayerProps> = ({
  children,
  zoomLevel = {},
}) => {
  const { meta, setMessage, setSelectableFeatures } =
    useContext(AssetSelectContext)
  const layerVisible = useLayerVisible(zoomLevel)
  const [data, setData] = useState<FeatureCollection>(NO_DATA)
  const bbox = useBoundingBox()

  const endpoint = meta?.endpoint
  const urlReplacements = endpoint &&
    bbox && {
      ...bbox,
      srsName: SRS_NAME,
    }
  const wfsUrl = urlReplacements
    ? Object.entries(urlReplacements).reduce(
        (acc, [key, replacement]) =>
          acc.replace(new RegExp(`{${key}}`, 'g'), replacement),
        endpoint
      )
    : ''
  const wfsFilterReplaced = urlReplacements
    ? Object.entries(urlReplacements).reduce(
        (acc, [key, replacement]) =>
          acc.replace(new RegExp(`{${key}}`, 'g'), replacement),
        (meta.wfsFilter as string) || ''
      )
    : ''

  const filter = meta.wfsFilter
    ? `<Filter><And>${wfsFilterReplaced}</And></Filter>`
    : ''

  useEffect(() => {
    if (!layerVisible) {
      setData(NO_DATA)
      setSelectableFeatures([])
      return
    }

    if (!bbox || !wfsUrl) return

    const url = new URL(wfsUrl)
    if (filter.length > 0) {
      const params = url.searchParams
      params.append('filter', filter)
    }

    const { request, controller } = fetchWithAbort(
      url.toString(),
      configuration.map.keys.dataPlatform && url.host === 'api.data.amsterdam.nl'
        ? {
            headers: { 'X-Api-Key': configuration.map.keys.dataPlatform },
          }
        : undefined
    )

    request
      .then(async (result) => result.json())
      .then((result) => {
        // to handle errors from the caterpillar api
        if (result.error) {
          // eslint-disable-next-line no-console
          console.error('Unhandled Error in wfs call', result.error.message)
        } else {
          let mappedResult = result

          if (isCaterpillarCategory(result.features[0])) {
            mappedResult = mapCaterpillarFeatures(result)
          }

          setData(mappedResult)

          const selectableFeatures = mapDataToSelectableFeature(
            mappedResult.features,
            meta.featureTypes,
            meta.featureStatusTypes
          )

          setSelectableFeatures(selectableFeatures)
        }
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
  }, [
    bbox,
    wfsUrl,
    layerVisible,
    setMessage,
    filter,
    setSelectableFeatures,
    meta.featureTypes,
    meta.featureStatusTypes,
  ])

  return <WfsDataProvider value={data}>{children}</WfsDataProvider>
}

export default WfsLayer
