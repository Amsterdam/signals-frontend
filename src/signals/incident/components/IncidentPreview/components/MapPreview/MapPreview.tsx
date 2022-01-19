// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'
import { Marker } from '@amsterdam/react-maps'

import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'

import MapStatic from 'components/MapStatic'
import Map from 'components/Map'

import type { Incident } from 'types/incident'
import type { FC } from 'react'
import type {
  FeatureType,
  Item,
} from 'signals/incident/components/form/MapSelectors/types'

const mapWidth = 640
const mapHeight = 300
const mapZoom = 12

const Address = styled.address`
  margin-bottom: ${themeSpacing(4)};
  font-style: normal;
`

const StyledMap = styled(Map)`
  max-width: ${mapWidth}px;
  height: ${mapHeight}px;
`

const StyledMarker = styled(Marker)`
  cursor: none;
`

interface MapPreviewProps {
  incident: Incident
  value: Item
  featureTypes?: FeatureType[]
}

const MapPreview: FC<MapPreviewProps> = ({ incident, value, featureTypes }) => {
  const { address, coordinates } = incident.location

  const options = {
    ...MAP_OPTIONS,
    zoom: mapZoom,
    attributionControl: false,
    center: coordinates,
  }

  let iconSrc = undefined

  if (value?.type !== 'not-on-map') {
    const featureType = featureTypes?.find(
      ({ typeValue }) => typeValue === value.type
    )

    if (featureType) {
      iconSrc = featureType.icon.iconUrl
    }
  }

  return (
    <>
      <Address data-testid="mapAddress">
        {address ? formatAddress(address) : 'Locatie gepind op de kaart'}
      </Address>

      {coordinates &&
        (configuration.featureFlags.useStaticMapServer ? (
          <MapStatic
            height={mapHeight}
            width={mapWidth}
            coordinates={coordinates}
            iconSrc={iconSrc}
          />
        ) : (
          <StyledMap mapOptions={options}>
            <StyledMarker args={[coordinates]} options={{ icon: markerIcon }} />
          </StyledMap>
        ))}
    </>
  )
}

export default MapPreview
