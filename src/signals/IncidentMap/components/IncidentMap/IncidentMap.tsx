// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect, useState, useRef } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import type { FeatureCollection } from 'geojson'
import type { Map as MapType, LatLngLiteral } from 'leaflet'

import { DEFAULT_ZOOM } from 'components/AreaMap/AreaMap'
import { useFetch } from 'hooks'
import type { Map as MapType, LatLngLiteral } from 'leaflet'
import configuration from 'shared/services/configuration/configuration'
import { dynamicIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { featureToCoordinates } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import type { Address } from 'types/address'

import type { PointLatLng } from '../../types'
import type { Filter, Properties, Incident } from '../../types'
import { AddressLocation } from '../AddressLocation'
import { DrawerOverlay, DrawerState } from '../DrawerOverlay'
import { isMobile, useDeviceMode } from '../DrawerOverlay/utils'
import { FilterPanel } from '../FilterPanel'
import { GPSLocation } from '../GPSLocation'
import { IncidentLayer } from '../IncidentLayer'
import { getFilteredIncidents } from '../utils'
import { Pin } from './Pin'
import { Wrapper, StyledMap, StyledParagraph } from './styled'

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>()
  const [map, setMap] = useState<MapType>()
  const [mapMessage, setMapMessage] = useState<JSX.Element | string>('')
  const [coordinates, setCoordinates] = useState<LatLngLiteral>()
  const [address, setAddress] = useState<Address>()

  const [showMessage, setShowMessage] = useState<boolean>(false)

  const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.Open)
  const [selectedIncident, setSelectedIncident] = useState<Incident>()
  const selectedMarkerRef = useRef<L.Marker>()

  const [filters, setFilters] = useState<Filter[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>()

  const mode = useDeviceMode()

  const { get, data, error, isSuccess } =
    useFetch<FeatureCollection<PointLatLng, Properties>>()

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
      const sanitaizedCoords = featureToCoordinates(incident.geometry)
      // When marker is underneath the drawerOverlay, move the map slightly up
      if (map && isMobile(mode) && sanitaizedCoords.lat < map.getCenter().lat) {
        const currentZoom = map.getZoom()
        const coords = {
          lat: sanitaizedCoords.lat - 0.0003,
          lng: sanitaizedCoords.lng,
        }
        const zoom =
          currentZoom > DEFAULT_ZOOM
            ? DEFAULT_ZOOM
            : currentZoom < 12
            ? 12
            : currentZoom

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

  useEffect(() => {
    if (bbox) {
      const { west, south, east, north } = bbox
      const searchParams = new URLSearchParams({
        bbox: `${west},${south},${east},${north}`,
      })

      get(
        `${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`
      )
    }
  }, [bbox, get])

  useEffect(() => {
    map?.on({
      click: resetSelectedMarker,
    })
  }, [resetSelectedMarker, map])

  useEffect(() => {
    if (data?.features) {
      const filteredIncidents = getFilteredIncidents(filters, data.features)
      setFilteredIncidents(filteredIncidents)
    }
  }, [data, filters])

  useEffect(() => {
    if (error) {
      setNotification('Er konden geen meldingen worden opgehaald.')
    }
  }, [error, isSuccess, setNotification])

  useEffect(() => {
    coordinates &&
      reverseGeocoderService(coordinates).then((response) => {
        setAddress(response?.data?.address)
      })
  }, [coordinates])

  return (
    <Wrapper>
      <StyledMap
        data-testid="incidentMap"
        fullScreen={false}
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
          handleIncidentSelect={handleIncidentSelect}
          passBbox={setBbox}
          incidents={filteredIncidents}
          resetSelectedMarker={resetSelectedMarker}
          selectedMarkerRef={selectedMarkerRef}
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
          <AddressLocation setCoordinates={setCoordinates} address={address} />
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            setMapMessage={setMapMessage}
          />
        </DrawerOverlay>

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
