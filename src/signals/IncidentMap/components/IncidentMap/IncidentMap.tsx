// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { ReactElement } from 'react'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import { Marker } from '@amsterdam/react-maps'
import type { Feature, FeatureCollection } from 'geojson'
import type { LatLngLiteral, Map as MapType } from 'leaflet'
import type { Marker as MarkerType } from 'leaflet'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import GPSButton from '../../../../components/GPSButton'
import { markerIcon } from '../../../../shared/services/configuration/map-markers'
import mapOptions from '../../../../shared/services/configuration/map-options'
import reverseGeocoderService from '../../../../shared/services/reverse-geocoder'
import type { Location } from '../../../../types/incident'
import type { LocationResult } from '../../../../types/location'
import {
  StyledViewerContainer,
  TopLeftWrapper,
} from '../../../incident/components/form/MapSelectors/Asset/Selector/styled'
import type { Filter, Point, Properties } from '../../types'
import { FilterPanel } from '../FilterPanel'
import { IncidentLayer } from '../IncidentLayer'
import { getFilteredIncidents } from '../utils'
import { Wrapper, Container, StyledMap } from './styled'

interface UpdatePayload {
  location: Location
}

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>(undefined)
  const [mapMessage, setMapMessage] = useState<string>('')
  const [mapGPSMessage, setMapGPSMessage] = useState<ReactElement | string>()
  const [filters, setFilters] = useState<Filter[]>([])
  const [filteredIncidents, setfilteredIncidents] =
    useState<Feature<Point, Properties>[]>()
  const [pinMarker, setPinMarker] = useState<MarkerType>()
  const [map, setMap] = useState<MapType>()
  const [coordinates, setCoordinates] = useState<LatLngLiteral>()

  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()
  const showMarker = coordinates

  useEffect(() => {
    if (!bbox) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, bbox])

  useEffect(() => {
    if (!data) {
      return
    }
    const filteredIncidents = getFilteredIncidents(filters, data.features)
    setfilteredIncidents(filteredIncidents)
  }, [data, filters])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      return
    }
  }, [error])

  useEffect(() => {
    if (!map || !pinMarker || !coordinates) return

    pinMarker.setLatLng(coordinates)
  }, [map, coordinates, pinMarker])

  useLayoutEffect(() => {
    if (!map || !coordinates) return

    const zoomLevel = mapOptions.zoom
      ? Math.max(map.getZoom(), mapOptions.zoom)
      : map.getZoom()

    map.flyTo(coordinates, zoomLevel)
  }, [coordinates, map])

  const updateIncident = useCallback((payload: UpdatePayload) => {
    setCoordinates(payload.location.coordinates)
  }, [])

  const getUpdatePayload = useCallback((location: Location) => {
    const payload: UpdatePayload = { location }
    return payload
  }, [])

  const fetchLocation = useCallback(
    async (latLng: LatLngLiteral) => {
      const location = {
        coordinates: latLng,
      }

      const payload = getUpdatePayload(location)

      // immediately set the location so that the marker is placed on the map; the reverse geocoder response
      // might take some time to resolve, leaving the user wondering if the map click actually did anything
      updateIncident(payload)

      if (payload.location) {
        const response = await reverseGeocoderService(latLng)
        payload.location.address = response?.data?.address
        updateIncident(payload)
      }
    },
    [getUpdatePayload, updateIncident]
  )

  return (
    <Wrapper>
      <Container>
        <StyledMap
          data-testid="incidentMap"
          hasZoomControls
          setInstance={setMap}
          hasGPSControl
          fullScreen
          mapOptions={{ ...MAP_OPTIONS, zoom: 9, attributionControl: false }}
        >
          <IncidentLayer passBbox={setBbox} incidents={filteredIncidents} />

          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            setMapMessage={setMapMessage}
          />

          <StyledViewerContainer
            topLeft={
              <TopLeftWrapper>
                <GPSButton
                  tabIndex={0}
                  onLocationSuccess={(location: LocationResult) => {
                    const coordinates = {
                      lat: location.latitude,
                      lng: location.longitude,
                    } as LatLngLiteral
                    fetchLocation(coordinates)
                  }}
                  onLocationError={() => {
                    setMapGPSMessage(
                      <>
                        <strong>
                          {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
                        </strong>
                        <p>
                          Dit kunt u wijzigen in de voorkeuren of instellingen
                          van uw browser of systeem.
                        </p>
                      </>
                    )
                  }}
                  onLocationOutOfBounds={() => {
                    setMapGPSMessage(
                      'Uw locatie valt buiten de kaart en is daardoor niet te zien'
                    )
                  }}
                />

                {mapGPSMessage && (
                  <MapMessage
                    data-testid="mapMessage"
                    onClick={() => {
                      setMapGPSMessage('')
                    }}
                  >
                    {mapGPSMessage}
                  </MapMessage>
                )}
              </TopLeftWrapper>
            }
          />
          {showMarker && (
            <span data-testid="assetPinMarker">
              <Marker
                key={Object.values(coordinates).toString()}
                setInstance={setPinMarker}
                args={[coordinates]}
                options={{
                  icon: markerIcon,
                  keyboard: false,
                }}
              />
            </span>
          )}

          {mapMessage && (
            <ViewerContainer
              topLeft={
                <MapMessage onClick={() => setMapMessage('')}>
                  {mapMessage}
                </MapMessage>
              }
            />
          )}
        </StyledMap>
      </Container>
    </Wrapper>
  )
}

export default IncidentMap
