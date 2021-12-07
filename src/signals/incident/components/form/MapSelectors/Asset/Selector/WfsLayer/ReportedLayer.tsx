// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import L from 'leaflet'
import { useMapInstance } from '@amsterdam/react-maps'
import './style.css'

import type { LatLng } from 'leaflet'
import type {
  Point,
  Feature as GeoJSONFeature,
  FeatureCollection,
} from 'geojson'
import type { FunctionComponent } from 'react'
import type { Item } from 'signals/incident/components/form/MapSelectors/Asset/types'

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

export interface ClusterMarker extends L.Layer {
  __parent: ClusterMarker
  _zoom: number
  _childCount: number
  _childClusters: ClusterMarker[]
  getLatLng: () => LatLng
  spiderfy: () => void
  unspiderfy: () => void
  zoomToBounds: (options: any) => void
}

/**
 * @description Recursive function that searches for the correct marker for a zoom level inside the cluster
 */
export const getMarkerByZoomLevel = (
  parent: ClusterMarker,
  zoom: number
): ClusterMarker | undefined => {
  if (parent._zoom === zoom) return parent
  if (!parent.__parent) return undefined
  return getMarkerByZoomLevel(parent.__parent, zoom)
}
/**
 * @description Depending on the zoomlevel, a cluster should be:
 *              - spyderfied when the current zoom level is the max zoom level
 *              - zoomed to when the zoom level is not max zoom level.
 */
export const shouldSpiderfy = (
  cluster: ClusterMarker,
  maxZoom?: number
): boolean => {
  let bottomCluster = cluster
  while (bottomCluster._childClusters.length === 1) {
    bottomCluster = bottomCluster._childClusters[0]
  }

  return (
    bottomCluster._zoom === maxZoom &&
    bottomCluster._childCount === cluster._childCount
  )
}

export const AssetLayer: FunctionComponent<DataLayerProps> = ({
  featureTypes,
  desktopView,
  allowClusters,
}) => {
  const mapInstance = useMapInstance()
  const [layerInstance, setLayerInstance] = useState<ClusterLayer>()
  const selectedCluster = useRef<ClusterMarker>()
  const data = useContext<FeatureCollection>(WfsDataContext)
  const { selection, update } = useContext(AssetSelectContext)

  /* istanbul ignore next */
  useEffect(() => {
    function onMoveEnd() {
      selectedCluster.current = undefined
    }

    mapInstance.on('moveend', onMoveEnd)

    return () => {
      mapInstance.off('moveend', onMoveEnd)
    }
  }, [mapInstance])

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
      return featureTypes.find(
        ({ typeField, typeValue }) =>
          feature.properties[typeField] === typeValue
      )
    },
    [featureTypes, allowClusters]
  )

  const options = useMemo(
    () => ({
      pointToLayer: (feature: Feature, latlng: LatLng) => {
        const featureType = getFeatureType(feature)
        if (!featureType) return L.marker({ ...latlng, lat: 0, lng: 0 })
        const selected =
          Array.isArray(selection) &&
          selection.some(
            // Exclude from coverage; with the curent leaflet mock this can't be tested
            /* istanbul ignore next*/ ({ id }) =>
              id === feature.properties[featureType.idField]
          )

        // const reported = feature.properties.meldingstatus === 1

        const iconUrl = `data:image/svg+xml;base64,${btoa(
          /* istanbul ignore next */ // Exclude from coverage; with the curent leaflet mock this can't be tested
          selected
            ? featureType.icon.selectedIconSvg ?? ''
            : featureType.icon.iconSvg
        )}`

        const marker = L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            className: `marker-icon ${
              feature.properties.meldingstatus === 1
                ? REPORTED_CLASS_MODIFIER
                : ''
            }`,
            iconUrl,
          }),
          alt: `${featureType.description} - ${
            feature.properties[featureType.idField]
          }`,
        })

        marker.on(
          'click',
          /* istanbul ignore next */ () => {
            const { description, typeValue, idField } = featureType
            if (typeValue === 'reported') {
              return
            }
            const item: Item = {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              id: feature.properties[idField]!,
              type: typeValue,
              description,
            }

            const updateSelection = selected
              ? selection.filter(({ id }) => id !== item.id)
              : [...selection, item]

            update(updateSelection)
          }
        )

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
  }, [layerInstance, data, options, selectedCluster, mapInstance, desktopView])

  return (
    <MarkerCluster
      clusterOptions={clusterOptions}
      setInstance={setLayerInstance}
    />
  )
}

export default AssetLayer
