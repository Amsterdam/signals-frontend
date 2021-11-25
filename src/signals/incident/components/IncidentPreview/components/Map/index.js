// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'
import { Marker } from '@amsterdam/react-maps'

import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'
import MapStatic from 'components/MapStatic'

import Map from 'components/Map'

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

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ value }) => {
  const longitude = value?.geometrie?.coordinates[0]
  const latitude = value?.geometrie?.coordinates[1]
  const options = {
    ...MAP_OPTIONS,
    zoom: mapZoom,
    attributionControl: false,
    center: [latitude, longitude],
  }

  const geometry = {
    latitude,
    longitude,
  }

  return (
    value && (
      <>
        <Address data-testid="mapAddress">
          {value?.address
            ? formatAddress(value.address)
            : 'Locatie gepind op de kaart'}
        </Address>
        {latitude &&
          longitude &&
          (configuration.featureFlags.useStaticMapServer ? (
            <MapStatic height={mapHeight} width={mapWidth} {...geometry} />
          ) : (
            <StyledMap mapOptions={options}>
              <StyledMarker
                args={[{ lat: latitude, lng: longitude }]}
                options={{ icon: markerIcon }}
              />
            </StyledMap>
          ))}
      </>
    )
  )
}

MapPreview.propTypes = {
  value: PropTypes.shape({
    address: PropTypes.shape({
      openbare_ruimte: PropTypes.string,
      huisnummer: PropTypes.string,
      huisletter: PropTypes.string,
      huisnummer_toevoeging: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
    geometrie: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  }),
}

export default MapPreview
