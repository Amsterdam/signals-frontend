// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import MapDetail from 'components/MapDetail'
import Paragraph from 'components/Paragraph'
import configuration from 'shared/services/configuration/configuration'
import { smallMarkerIcon } from 'shared/services/configuration/map-markers'
import type { Address as AddressType } from 'types/address'

export const MapThumbnailButton = styled.div.attrs({
  role: 'button',
  tabIndex: 0,
})`
  width: max-content;
  margin-right: ${themeSpacing(2)};
`

export const MapThumbnail = styled(MapDetail).attrs({
  canFocusMarker: false,
  hasZoomControls: false,
  icon: smallMarkerIcon,
  zoom: configuration.map.optionsExternalReplyLocation.zoom,
})`
  width: 80px;
  height: 80px;
  :hover {
    cursor: pointer;
    filter: brightness(90%);
  }
`

export const LocationSection = styled.section`
  display: flex;
  margin-bottom: ${themeSpacing(8)};
`

type LocationProps = {
  onClick: () => void
  location: Partial<{
    address: Partial<AddressType> | null
    address_text?: string | null
    geometrie: {
      coordinates: [number, number]
      type: string
    }
    stadsdeel: string | null
  }>
}

const Location = ({ onClick, location }: LocationProps) => {
  const handleMapThumbnailKey: React.KeyboardEventHandler<HTMLElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      onClick()
    }
  }

  const hasAddress =
    location.address !== null && Object.keys(location.address || {}).length > 0

  const address = hasAddress
    ? [
        location.stadsdeel,

        `${location.address?.openbare_ruimte} ${location.address?.huisnummer}${
          location.address?.huisletter
        }${
          location.address?.huisnummer_toevoeging &&
          `-${location.address?.huisnummer_toevoeging}`
        }`,

        `${location.address?.postcode} ${location.address?.woonplaats}`,
      ].filter(Boolean)
    : ['Locatie is gepind op de kaart']

  return (
    <LocationSection>
      <MapThumbnailButton
        data-testid="map-thumbnail-button"
        onKeyDown={handleMapThumbnailKey}
        onClick={onClick}
      >
        <MapThumbnail value={{ geometrie: location.geometrie }} />
      </MapThumbnailButton>
      <div>
        {address.map((addressItem, index) => (
          <Paragraph key={index}>{addressItem}</Paragraph>
        ))}
      </div>
    </LocationSection>
  )
}

export default Location
