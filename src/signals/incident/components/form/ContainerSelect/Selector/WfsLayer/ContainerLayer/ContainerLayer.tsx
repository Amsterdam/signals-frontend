// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import L from 'leaflet'
import { useMapInstance } from '@amsterdam/react-maps'
import isEqual from 'lodash/isEqual'

import type { LatLng, MarkerCluster as LeafletMarkerCluster } from 'leaflet'
import type {
  Point,
  Feature as GeoJSONFeature,
  FeatureCollection,
} from 'geojson'
import type { FunctionComponent } from 'react'
import type {
  DataLayerProps,
  Item,
  Feature,
} from 'signals/incident/components/form/ContainerSelect/types'

import ContainerSelectContext from 'signals/incident/components/form/ContainerSelect/context'
import { featureTolocation } from 'shared/services/map-location'
import MarkerCluster from 'components/MarkerCluster'

import WfsDataContext from '../context'

const SELECTED_CLASS_MODIFIER = '--selected'

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

export const ContainerLayer: FunctionComponent<DataLayerProps> = ({
  featureTypes,
  desktopView,
}) => {
  const mapInstance = useMapInstance()
  const [layerInstance, setLayerInstance] = useState<ClusterLayer>()
  const selectedCluster = useRef<ClusterMarker>()
  const data = useContext<FeatureCollection>(WfsDataContext)
  const { selection, update } = useContext(ContainerSelectContext)

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

  const iconCreateFunction = useCallback(
    /* istanbul ignore next */ (cluster: LeafletMarkerCluster) => {
      const childCount = cluster.getChildCount()
      const hasSelectedChildren = cluster
        .getAllChildMarkers()
        .some((marker) =>
          marker.options.icon?.options.className?.includes(
            SELECTED_CLASS_MODIFIER
          )
        )

      return new L.DivIcon({
        html: `<div data-testid="markerClusterIcon"><span>${childCount}</span></div>`,
        className: `marker-cluster${
          hasSelectedChildren ? ` marker-cluster${SELECTED_CLASS_MODIFIER}` : ''
        }`,
        iconSize: new L.Point(40, 40),
      })
    },
    []
  )

  const clusterOptions = useMemo(
    () => ({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction,
    }),
    [iconCreateFunction]
  )

  const getFeatureType = useCallback(
    (feature: Feature) =>
      featureTypes.find(
        ({ typeField, typeValue }) =>
          feature.properties[typeField] === typeValue
      ),
    [featureTypes]
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

        const iconUrl = `data:image/svg+xml;base64,${btoa(
          /* istanbul ignore next */ // Exclude from coverage; with the curent leaflet mock this can't be tested
          selected
            ? featureType.icon.selectedIconSvg ?? ''
            : featureType.icon.iconSvg
        )}`

        const marker = L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            /* istanbul ignore next */
            className: `marker-icon${selected ? SELECTED_CLASS_MODIFIER : ''}`,
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

      layerInstance.on(
        'clusterclick',
        /* istanbul ignore next */ (event: { layer: ClusterMarker }) => {
          const { _maxZoom: maxZoom } = layerInstance
          if (shouldSpiderfy(event.layer, maxZoom)) {
            if (selectedCluster.current) {
              event.layer.spiderfy()
              const latlng = event.layer.getLatLng()
              const selectedLatLng = selectedCluster.current.getLatLng()

              if (!isEqual(latlng, selectedLatLng))
                selectedCluster.current = event.layer
            } else {
              selectedCluster.current = event.layer
              selectedCluster.current.spiderfy()
            }
          } else {
            // use this offset (x, y form the bottom right corner of the map)
            // when zooming to bounds to keep the markers above the panel in mobile view
            const zoomOffset = desktopView ? [0, 0] : [0, 300]
            event.layer.zoomToBounds({ paddingBottomRight: zoomOffset })
          }
        }
      )

      /* istanbul ignore next */
      if (selectedCluster.current) {
        const selectedLatLng = selectedCluster.current.getLatLng()
        const cluster = (layerInstance.getLayers() as ClusterMarker[]).find(
          (layer) => {
            const latlng = layer.__parent.getLatLng()
            return isEqual(latlng, selectedLatLng)
          }
        )

        const parent = getMarkerByZoomLevel(
          cluster as any,
          mapInstance.getZoom()
        )

        if (parent) {
          selectedCluster.current = parent
          selectedCluster.current.spiderfy()
        }
      }
    }

    return () => {
      if (layerInstance) {
        layerInstance.off('clusterclick')
      }
    }
  }, [layerInstance, data, options, selectedCluster, mapInstance, desktopView])

  return (
    <MarkerCluster
      clusterOptions={clusterOptions}
      setInstance={setLayerInstance}
    />
  )
}

export default ContainerLayer
