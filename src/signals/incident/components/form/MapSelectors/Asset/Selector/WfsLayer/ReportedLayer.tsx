// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { useMapInstance } from '@amsterdam/react-maps'
import './style.css'

import type { LatLng } from 'leaflet'
import type {
  Point,
  Feature as GeoJSONFeature,
  FeatureCollection,
} from 'geojson'
import type { FC } from 'react'

import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { featureTolocation } from 'shared/services/map-location'
import MarkerCluster from 'components/MarkerCluster'

import configuration from 'shared/services/configuration/configuration'
import {
  DataLayerProps,
  Feature,
} from 'signals/incident/components/form/MapSelectors/Asset/types'
import WfsDataContext from './context'

const REPORTED_CLASS_MODIFIER = 'marker-reported'

export interface ClusterLayer extends L.GeoJSON<Point> {
  _maxZoom?: number
}

export const ReportedLayer: FC<DataLayerProps> = ({
  featureTypes,
  desktopView,
  allowClusters,
}) => {
  const mapInstance = useMapInstance()
  const [layerInstance, setLayerInstance] = useState<ClusterLayer>()
  const data = useContext<FeatureCollection>(WfsDataContext)
  const { selection, update } = useContext(AssetSelectContext)

  const clusterOptions = useMemo(
    () => ({
      disableClusteringAtZoom: allowClusters
        ? configuration.map.options.maxZoom
        : configuration.map.options.minZoom,
      zoomToBoundsOnClick: true,
    }),
    []
  )

  const getFeatureType = useCallback(
    (feature: Feature) => {
      if (feature.properties.meldingstatus === 1) {
        return featureTypes.find(({ typeValue }) => typeValue === 'reported')
      }
    },
    [featureTypes, allowClusters]
  )

  const options = useMemo(
    () => ({
      pointToLayer: (feature: Feature, latlng: LatLng) => {
        const featureType = getFeatureType(feature)
        if (!featureType) return

        const marker = L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            className: `marker-icon ${
              feature.properties.meldingstatus === 1
                ? REPORTED_CLASS_MODIFIER
                : ''
            }`,
            iconUrl: `data:image/svg+xml;base64,${btoa(
              featureType.icon.iconSvg
            )}`,
          }),
          alt: `${featureType.description} - ${
            feature.properties[featureType.idField]
          }`,
        })

        return marker
      },
    }),
    [getFeatureType, selection, update]
  )

  useEffect(() => {
    if (layerInstance) {
      layerInstance.clearLayers()
      data.features.forEach((feature) => {
        const pointFeature: GeoJSONFeature<Point, any> = {
          ...feature,
          geometry: { ...(feature.geometry as Point) },
        }
        const { coordinates } = pointFeature.geometry
        const latlng = featureTolocation({ coordinates })
        const marker = options.pointToLayer(pointFeature, latlng)

        /* istanbul ignore else */
        if (marker) {
          layerInstance.addLayer(marker)
        }
      })
    }
  }, [layerInstance, data, options, mapInstance, desktopView])

  return (
    <MarkerCluster
      clusterOptions={clusterOptions}
      setInstance={setLayerInstance}
    />
  )
}

export default ReportedLayer
