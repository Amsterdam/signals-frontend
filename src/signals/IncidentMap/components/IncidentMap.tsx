// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { ReactElement } from 'react'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

import { Marker } from '@amsterdam/react-maps'
import type { LatLngLiteral } from 'leaflet'
import type { Map as MapType, Marker as MarkerType } from 'leaflet'
import styled from 'styled-components'

import Map from 'components/Map'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import mapOptions from 'shared/services/configuration/map-options'

import GPSButton from '../../../components/GPSButton'
import configuration from '../../../shared/services/configuration/configuration'
import { markerIcon } from '../../../shared/services/configuration/map-markers'
import reverseGeocoderService from '../../../shared/services/reverse-geocoder'
import type { Location } from '../../../types/incident'
import type { LocationResult } from '../../../types/location'
import DetailPanel from '../../incident/components/form/MapSelectors/Asset/Selector/DetailPanel'
import {
  StyledViewerContainer,
  TopLeftWrapper,
} from '../../incident/components/form/MapSelectors/Asset/Selector/styled'
import { MapMessage } from '../../incident/components/form/MapSelectors/components/MapMessage'
import IncidentLayer from './IncidentLayer'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  display: flex;
`

const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 0;
`

interface UpdatePayload {
  location: Location
}

const IncidentMap = () => {
  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const [pinMarker, setPinMarker] = useState<MarkerType>()
  const [map, setMap] = useState<MapType>()
  const [coordinates, setCoordinates] = useState<LatLngLiteral>()

  const showMarker = coordinates

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
      <DetailPanel />
      <StyledMap
        data-testid="incidentMap"
        hasZoomControls
        setInstance={setMap}
        hasGPSControl
        fullScreen
        mapOptions={{
          ...MAP_OPTIONS,
          zoom: 9,
          scrollWheelZoom: true,
          attributionControl: false,
        }}
      >
        <IncidentLayer />
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
                  setMapMessage(
                    <>
                      <strong>
                        {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
                      </strong>
                      <p>
                        Dit kunt u wijzigen in de voorkeuren of instellingen van
                        uw browser of systeem.
                      </p>
                    </>
                  )
                }}
                onLocationOutOfBounds={() => {
                  setMapMessage(
                    'Uw locatie valt buiten de kaart en is daardoor niet te zien'
                  )
                }}
              />

              {mapMessage && (
                <MapMessage
                  data-testid="mapMessage"
                  onClick={() => {
                    setMapMessage('')
                  }}
                >
                  {mapMessage}
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
      </StyledMap>
    </Wrapper>
  )
}

export default IncidentMap
