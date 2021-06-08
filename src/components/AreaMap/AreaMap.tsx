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
import type { MapOptions, LatLngExpression } from 'leaflet'
import styled from 'styled-components'
import { ViewerContainer } from '@amsterdam/arm-core'

import Map from 'components/Map'
import MarkerCluster from 'components/MarkerCluster'
import { isStatusEnd } from 'signals/incident-management/definitions/statusList'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import {
  closedIncidentIcon,
  openIncidentIcon,
  pointerSelectIcon,
} from 'shared/services/configuration/map-markers'
import MapCloseButton from 'components/MapCloseButton'

import { AreaFeature, AreaFeatureCollection, Property } from './types'

const AREA_MAP_OPTIONS: MapOptions = {
  ...MAP_OPTIONS,
  scrollWheelZoom: true,
}

const DEFAULT_ZOOM = 13
const DEFAULT_BOUNDS = 250 // Meter

const Wrapper = styled.div`
  height: 100%;
  position: relative;
`

const StyledMap = styled(Map)`
  height: 100%;
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

  useEffect(() => {
    selectedFeatureId.current = selectedFeature?.properties.id
  }, [selectedFeature?.properties.id])

  const mapOptions: MapOptions = useMemo(
    () => ({
      ...AREA_MAP_OPTIONS,
      center: center as LatLngExpression,
      zoom: DEFAULT_ZOOM,
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
      // Although the zoom level provides an approximation to the desired bounds, the bounds need to be manually set
      const centerLatLng = new LatLng(center[1], center[0])
      const bounds = centerLatLng.toBounds(DEFAULT_BOUNDS)
      map.fitBounds(bounds)

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
  }, [center, map, onClick])

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
      <StyledMap hasZoomControls mapOptions={mapOptions} setInstance={setMap}>
        <MarkerCluster
          setInstance={setMarkers}
          getIsSelectedCluster={getIsSelectedCluster}
        />
        <ViewerContainer topRight={<MapCloseButton onClick={onClose} />} />
      </StyledMap>
    </Wrapper>
  )
}

export default AreaMap
