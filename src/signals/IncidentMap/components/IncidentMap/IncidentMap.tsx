// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect, useRef, useState } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import type { LatLngLiteral, Map as MapType } from 'leaflet'
import { throttle, isEqual } from 'lodash'

import { dynamicIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { formatAddress } from 'shared/services/format-address'
import { featureToCoordinates } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Filter, Incident, Properties } from '../../types'
import { AddressLocation } from '../AddressLocation'
import { AddressSearchMobile } from '../AddressLocation'
import { DrawerOverlay, DrawerState } from '../DrawerOverlay'
import { isMobile, useDeviceMode } from '../DrawerOverlay/utils'
import { FilterPanel } from '../FilterPanel'
import { GPSLocation } from '../GPSLocation'
import { IncidentLayer } from '../IncidentLayer'
import {
  countIncidentsPerFilter,
  DEFAULT_ZOOM,
  getFilteredIncidents,
} from '../utils'
import { Pin } from './Pin'
import { StyledMap, StyledParagraph, Wrapper } from './styled'
import usePaginatedIncidents from './usePaginatedIncidents'
import { getZoom } from './utils'

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>()
  const [map, setMap] = useState<MapType>()
  const [mapMessage, setMapMessage] = useState<JSX.Element | string>('')
  const [coordinates, setCoordinates] = useState<LatLngLiteral>()
  const [address, setAddress] = useState<string>()

  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [showAddressSearchMobile, setShowAddressSearchMobile] = useState(false)

  const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.Open)
  const [selectedIncident, setSelectedIncident] = useState<Incident>()
  const selectedMarkerRef = useRef<L.Marker<Properties>>()

  const [filters, setFilters] = useState<Filter[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>()

  const mode = useDeviceMode()

  const closeDrawerOverlay = useCallback(() => {
    setDrawerState(DrawerState.Closed)
  }, [])

  const setNotification = useCallback(
    (message: JSX.Element | string) => {
      setMapMessage(message)
      setShowMessage(true)
    },
    [setMapMessage, setShowMessage]
  )

  /* istanbul ignore next */
  const handleIncidentSelect = useCallback(
    (incident: Incident) => {
      const sanitizedCoords = featureToCoordinates(incident.geometry)
      // When marker is underneath the drawerOverlay, move the map slightly up
      if (map && isMobile(mode) && sanitizedCoords.lat < map.getCenter().lat) {
        const coords = {
          lat: sanitizedCoords.lat - 0.0003,
          lng: sanitizedCoords.lng,
        }
        const zoom = getZoom(map)
        map.flyTo(coords, zoom)
      }

      setSelectedIncident(incident)
      setDrawerState(DrawerState.Open)
    },
    [map, mode]
  )

  /* istanbul ignore next */
  const resetSelectedMarker = useCallback(() => {
    if (selectedMarkerRef?.current) {
      selectedMarkerRef.current.setIcon(
        dynamicIcon(selectedMarkerRef.current.feature?.properties.icon)
      )
    }
    selectedMarkerRef.current = undefined
    setSelectedIncident(undefined)
  }, [])

  /* istanbul ignore next */
  useEffect(() => {
    map?.on({
      click: resetSelectedMarker,
    })
  }, [resetSelectedMarker, map])

  /* istanbul ignore next */
  const { incidents, error, getIncidents } = usePaginatedIncidents()

  /* istanbul ignore next */
  const throttledGetIncidents = throttle((arg) => getIncidents(arg), 500, {
    trailing: false,
  })

  /* istanbul ignore next */
  useEffect(() => {
    if (bbox) {
      throttledGetIncidents(bbox)
    }
  }, [bbox, throttledGetIncidents])

  /* istanbul ignore next */
  useEffect(() => {
    if (incidents.length === 0) return

    const filteredIncidents = getFilteredIncidents(filters, incidents)

    setFilteredIncidents(filteredIncidents)
    const filterFromIncidents = countIncidentsPerFilter(filters, incidents)
    if (!isEqual(filterFromIncidents, filters)) {
      setFilters(filterFromIncidents)
    }
  }, [bbox, filters, incidents])

  useEffect(() => {
    if (error) {
      setNotification('Er konden geen meldingen worden opgehaald.')
    }
  }, [error, setNotification])

  useEffect(() => {
    if (coordinates) {
      reverseGeocoderService(coordinates).then((response) => {
        const address = response?.data?.address
          ? formatAddress(response?.data?.address)
          : undefined
        setAddress(address)
      })
    } else {
      setAddress(undefined)
    }
  }, [coordinates])

  const zoomLevel = map?.getZoom() || DEFAULT_ZOOM

  return (
    <Wrapper>
      <StyledMap
        data-testid="incident-map"
        hasZoomControls
        setInstance={setMap}
        mapOptions={{
          ...MAP_OPTIONS,
          dragging: true,
          scrollWheelZoom: true,
          zoom: 9,
          attributionControl: false,
        }}
      >
        <IncidentLayer
          selectedIncident={selectedIncident}
          handleIncidentSelect={handleIncidentSelect}
          passBbox={setBbox}
          incidents={filteredIncidents}
          resetSelectedMarker={resetSelectedMarker}
          selectedMarkerRef={selectedMarkerRef}
          zoomLevel={zoomLevel}
        />

        {map && coordinates && (
          <Pin
            map={map}
            coordinates={coordinates}
            mode={mode}
            closeOverlay={closeDrawerOverlay}
          />
        )}

        {map && (
          <GPSLocation
            setNotification={setNotification}
            setCoordinates={setCoordinates}
            panelIsOpen={drawerState}
          />
        )}

        <DrawerOverlay
          onStateChange={setDrawerState}
          state={drawerState}
          onCloseDetailPanel={resetSelectedMarker}
          incident={selectedIncident}
        >
          <StyledParagraph>
            Op deze kaart staan meldingen in de openbare ruimte waarmee we aan
            het werk zijn. Vanwege privacy staat een klein deel van de meldingen
            niet op de kaart.
          </StyledParagraph>
          <AddressLocation
            setCoordinates={setCoordinates}
            address={address}
            setShowAddressSearchMobile={setShowAddressSearchMobile}
          />
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            setMapMessage={setMapMessage}
          />
        </DrawerOverlay>

        {isMobile(mode) && showAddressSearchMobile && (
          <AddressSearchMobile
            address={address}
            setCoordinates={setCoordinates}
            setShowAddressSearchMobile={setShowAddressSearchMobile}
          />
        )}

        {mapMessage && showMessage && (
          <ViewerContainer
            topLeft={
              <MapMessage onClick={() => setShowMessage(false)}>
                {mapMessage}
              </MapMessage>
            }
          />
        )}
      </StyledMap>
    </Wrapper>
  )
}

export default IncidentMap
