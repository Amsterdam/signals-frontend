// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react'
import type { Point, Position } from 'geojson'
import L, { LatLng } from 'leaflet'
import type { MapOptions } from 'leaflet'
import styled from 'styled-components'
import { ViewerContainer, Marker } from '@amsterdam/arm-core'

import Map from 'components/Map'
import MarkerCluster from 'components/MarkerCluster'
import { isStatusEnd } from 'signals/incident-management/definitions/statusList'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import {
  closedIncidentIcon,
  openIncidentIcon,
  pointerSelectIcon,
  currentIncidentIcon,
} from 'shared/services/configuration/map-markers'
import MapCloseButton from 'components/MapCloseButton'

import { AreaFeature, AreaFeatureCollection, Property } from './types'

const DEFAULT_ZOOM = 14
const MAX_ZOOM = 15
const FOCUS_RADIUS_METERS = 50
const CURRENT_INCIDENT_MARKER_Z = -100 // Show below incident markers

const AREA_MAP_OPTIONS: MapOptions = {
  ...MAP_OPTIONS,
  scrollWheelZoom: true,
  zoom: DEFAULT_ZOOM,
  maxZoom: MAX_ZOOM,
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

export interface AreaMapProps {
  geoData: AreaFeatureCollection
  selectedFeature: AreaFeature | null
  onClose: () => void
  onClick: (feature: AreaFeature | null) => void
  center: Position
}

const AreaMap: FunctionComponent<AreaMapProps> = ({
  geoData,
  center,
  selectedFeature,
  onClose,
  onClick,
}) => {
  const [markers, setMarkers] = useState<L.GeoJSON<Point>>()
  const [map, setMap] = useState<L.Map>()
  const selectedFeatureId = useRef<number>()
  const centerLatLng = useMemo<LatLng>(
    () => new LatLng(center[1], center[0]),
    [center]
  )

  useEffect(() => {
    selectedFeatureId.current = selectedFeature?.properties.id
  }, [selectedFeature?.properties.id])

  const mapOptions = useMemo(
    () => ({
      ...AREA_MAP_OPTIONS,
      center: center.reverse(), // center is [lat, long] instead of [long, lag],
    }),
    [center]
  )

  const getIncidentIcon = useCallback(
    (feature: AreaFeature): L.Icon => {
      // selected
      if (feature.properties.id === selectedFeature?.properties.id)
        return pointerSelectIcon

      // closed
      if (isStatusEnd(feature.properties.status.state))
        return closedIncidentIcon

      // open
      return openIncidentIcon
    },
    [selectedFeature?.properties.id]
  )

  const getIsSelectedCluster = useCallback(
    /* istanbul ignore next */
    (cluster: L.MarkerCluster): boolean =>
      cluster
        .getAllChildMarkers()
        .some(
          (child: L.Marker<AreaFeature>) =>
            child.feature?.properties.id === selectedFeatureId.current
        ),
    []
  )

  useEffect(() => {
    if (map) {
      // Deselect marker by clicking on map
      map.on({
        click:
          /* istanbul ignore next */
          () => {
            if (selectedFeatureId.current) {
              onClick(null)
            }
          },
      })
    }
  }, [center, centerLatLng, map, onClick])

  // Render focus circle
  useEffect(() => {
    if (map) {
      // Padding factor used to increase size of grey background
      // Setting it too high will decrease the reliability of the radius calculation
      const PAD_FACTOR = 15
      const BACKGROUND_OPACITY = 0.2
      const SVG_SQUARE_SIZE = 1000
      const CIRCLE_X = SVG_SQUARE_SIZE / 2
      const CIRCLE_Y = SVG_SQUARE_SIZE / 2

      // SVG bounds
      const svgBounds = map.getBounds().pad(PAD_FACTOR)

      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', `0 0 ${SVG_SQUARE_SIZE} ${SVG_SQUARE_SIZE}`)

      // Compute SVG side length in meters
      const { x, y } = map.getSize()
      const toPoint =
        x > y ? svgBounds.getSouthEast() : svgBounds.getNorthWest()
      const fromPoint = svgBounds.getNorthEast()
      const svgSideLengthInMeters = map.distance(fromPoint, toPoint)

      // Compute circle radius in SVG viewBox coordinate units
      const circleRadius = Math.floor(
        (FOCUS_RADIUS_METERS / svgSideLengthInMeters) * SVG_SQUARE_SIZE
      )

      svg.innerHTML = `
        <rect width="100%" height="100%" mask="url(#areaMapMask)"/>
        <mask id="areaMapMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" opacity="${BACKGROUND_OPACITY}"/>
            <circle r="${circleRadius}" cx=${CIRCLE_X} cy=${CIRCLE_Y} fill="black"/>
        </mask>
      `

      L.svgOverlay(svg, svgBounds).addTo(map)
    }
  }, [map])

  // Render markers
  useEffect(() => {
    if (markers) {
      markers.clearLayers()
      L.geoJSON<Property>(geoData, {
        pointToLayer: (feature, latlng) => {
          const icon = getIncidentIcon(feature)
          const marker = L.marker(latlng, {
            icon,
          })

          marker.on({
            click:
              /* istanbul ignore next */
              () => onClick(feature),
          })

          return marker
        },
      }).addTo(markers)
    }
  }, [geoData, getIncidentIcon, markers, onClick, selectedFeatureId])

  return (
    <Wrapper>
      <Map
        hasZoomControls
        fullScreen
        mapOptions={mapOptions}
        setInstance={setMap}
      >
        <Marker
          latLng={centerLatLng}
          options={{
            icon: currentIncidentIcon,
            interactive: false,
            zIndexOffset: CURRENT_INCIDENT_MARKER_Z,
          }}
        />
        <MarkerCluster
          setInstance={setMarkers}
          getIsSelectedCluster={getIsSelectedCluster}
        />
        <ViewerContainer topRight={<MapCloseButton onClick={onClose} />} />
      </Map>
    </Wrapper>
  )
}

export default AreaMap
