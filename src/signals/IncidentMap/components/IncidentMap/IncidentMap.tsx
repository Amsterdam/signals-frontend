// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import type { FeatureCollection } from 'geojson'
import type { Feature } from 'geojson'
import { useFetch } from 'hooks'
import type { LatLngLiteral, Map as MapType } from 'leaflet'
import configuration from 'shared/services/configuration/configuration'
import { dynamicIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { formatAddress } from 'shared/services/format-address'
import { featureToCoordinates } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Filter, Incident, PointLatLng, Properties } from '../../types'
import { AddressLocation } from '../AddressLocation'
import { AddressSearchMobile } from '../AddressLocation/AddressSearchMobile'
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
  const searchParams = useMemo(() => {
    if (bbox) {
      const { west, south, east, north } = bbox
      return new URLSearchParams({
        bbox: `${west},${south},${east},${north}`,
      })
    }
  }, [bbox])

  /* istanbul ignore next */
  useEffect(() => {
    if (bbox && searchParams) {
      get(
        `${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`
      )
      paginatedIncidents.current.page = 2
    }
  }, [bbox, get, searchParams])

  /* istanbul ignore next */
  const paginatedIncidents = useRef<{
    page: number
    features: Feature<PointLatLng, Properties>[]
  }>({ page: 2, features: [] })

  /* istanbul ignore next */
  const getPaginatedIncidents = useCallback(() => {
    const incidents = data?.features || []

    if (searchParams && incidents.length === 4000) {
      searchParams.set('geopage', paginatedIncidents.current.page.toString())

      get(
        `${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`
      )

      paginatedIncidents.current.page = paginatedIncidents.current.page + 1
    }
  }, [data?.features, get, searchParams])

  /* istanbul ignore next */
  useEffect(() => {
    map?.on({
      click: resetSelectedMarker,
    })
  }, [resetSelectedMarker, map])

  /* istanbul ignore next */
  useEffect(() => {
    getPaginatedIncidents()
    if (paginatedIncidents.current.page === 2 && data?.features) {
      paginatedIncidents.current.features = data.features
    }
    if (paginatedIncidents.current.page > 2 && data?.features) {
      paginatedIncidents.current.features = [
        ...paginatedIncidents.current.features,
        ...data.features,
      ]
    }

    const incidents = paginatedIncidents.current.features || []

    const filteredIncidents = getFilteredIncidents(filters, incidents)
    setFilteredIncidents(filteredIncidents)
    const filterFromIncidents = countIncidentsPerFilter(filters, incidents)
    if (
      !filterFromIncidents.every((item) =>
        filters.map((filter) => filter._display).includes(item._display)
      )
    ) {
      setFilters(filterFromIncidents)
    }
  }, [data, filters, getPaginatedIncidents])

  useEffect(() => {
    if (error) {
      setNotification('Er konden geen meldingen worden opgehaald.')
    }
  }, [error, isSuccess, setNotification])

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
        data-testid="incidentMap"
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
