// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import type { FeatureCollection } from 'geojson'
import type { Map as MapType, LatLngLiteral } from 'leaflet'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'
import type { Address } from 'types/address'

import type { Filter, Point, Properties, Incident } from '../../types'
import { AddressLocation } from '../AddressLocation'
import { DrawerOverlay, DrawerState } from '../DrawerOverlay'
import { FilterPanel } from '../FilterPanel'
import { GPSLocation } from '../GPSLocation'
import { IncidentLayer } from '../IncidentLayer'
import { getFilteredIncidents } from '../utils'
import { Pin } from './Pin'
import { Wrapper, StyledMap, StyledParagraph } from './styled'

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>()
  const [mapMessage, setMapMessage] = useState<JSX.Element | string>('')
  const [coordinates, setCoordinates] = useState<LatLngLiteral>()
  const [address, setAddress] = useState<Address>()

  const [showMessage, setShowMessage] = useState<boolean>(false)

  const [drawerState, setDrawerState] = useState<DrawerState>(DrawerState.Open)
  const [selectedIncident, setSelectedIncident] = useState<Incident>()

  const [filters, setFilters] = useState<Filter[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>()
  const [map, setMap] = useState<MapType>()

  const { get, data, error, isSuccess } =
    useFetch<FeatureCollection<Point, Properties>>()

  const setNotification = useCallback(
    (message: JSX.Element | string) => {
      setMapMessage(message)
      setShowMessage(true)
    },
    [setMapMessage, setShowMessage]
  )
  /* istanbul ignore next */
  const handleIncidentSelect = useCallback((incident) => {
    setSelectedIncident(incident)
    incident && setDrawerState(DrawerState.Open)
  }, [])

  /* istanbul ignore next */
  const resetMarkerIcons = useCallback(() => {
    // TODO: Should reset the icons to their default
  }, [])

  /* istanbul ignore next */
  const handleCloseDetailPanel = useCallback(() => {
    setSelectedIncident(undefined)
    resetMarkerIcons()
  }, [resetMarkerIcons])

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
  }, [get, bbox])

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
    const transformCoordinatesToAddress = async () => {
      if (coordinates) {
        const response = await reverseGeocoderService(coordinates)
        setAddress(response?.data?.address)
      }
    }
    // noinspection JSIgnoredPromiseFromCall
    transformCoordinatesToAddress()
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
          passBbox={setBbox}
          incidents={filteredIncidents}
          handleIncidentSelect={handleIncidentSelect}
          handleCloseDetailPanel={handleCloseDetailPanel}
          resetMarkerIcons={resetMarkerIcons}
        />

        {map && coordinates && <Pin map={map} coordinates={coordinates} />}

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
          onCloseDetailPanel={handleCloseDetailPanel}
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
            setAddress={setAddress}
          />
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
