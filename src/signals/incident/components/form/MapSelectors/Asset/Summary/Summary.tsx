// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { Marker } from '@amsterdam/react-maps'

import type { FC, KeyboardEvent } from 'react'

import MapStatic from 'components/MapStatic'
import Map from 'components/Map'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { markerIcon } from 'shared/services/configuration/map-markers'
import { formatAddress } from 'shared/services/format-address'
import configuration from 'shared/services/configuration/configuration'
import { selectionIsUndetermined } from '../../constants'
import type { SummaryProps } from '../types'

const mapWidth = 640
const mapHeight = 180
const mapZoom = 12
const iconSize = 40

const Wrapper = styled.div`
  position: relative;
  margin: ${themeSpacing(0, 0, 0, 0)};
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`

const StyledMapStatic = styled(MapStatic)`
  margin: ${themeSpacing(0, 0, 2, 0)};
`

const StyledMap = styled(Map)`
  max-width: ${mapWidth}px;
  height: ${mapHeight}px;
`

const StyledMarker = styled(Marker)`
  cursor: none;
`

const StyledImg = styled.img`
  margin-right: ${themeSpacing(4)};
  flex-shrink: 0;
`

const LocationDescription = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${themeSpacing(2)};
  margin-bottom: ${themeSpacing(3)};
`

const defaultCenter = {
  lat: configuration.map.options.center[0],
  lng: configuration.map.options.center[1],
}

const Summary: FC<SummaryProps> = ({
  address,
  coordinates,
  selection,
  edit,
  featureTypes,
}) => {
  const { id, type } = selection || {}
  const { description } =
    featureTypes.find(({ typeValue }) => typeValue === type) ?? {}
  const center = coordinates || defaultCenter

  const options = {
    ...MAP_OPTIONS,
    zoom: mapZoom,
    attributionControl: false,
    center,
  }

  const summaryDescription = [description, id].filter(Boolean).join(' - ')
  let summaryAddress = address ? formatAddress(address) : ''
  summaryAddress =
    !summaryAddress && coordinates
      ? 'Locatie is gepind op de kaart'
      : summaryAddress

  const iconSrc = useMemo(() => {
    if (!selection?.type || selectionIsUndetermined(selection)) {
      return undefined
    }

    const featureType = featureTypes.find(
      ({ typeValue }) => typeValue === selection.type
    )

    return featureType && featureType.icon.iconUrl
  }, [selection, featureTypes])

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event?.key === 'Enter') {
        edit && edit(event)
      }
    },
    [edit]
  )

  return (
    <Wrapper data-testid="assetSelectSummary">
      {configuration.featureFlags.useStaticMapServer ? (
        <StyledMapStatic
          height={mapHeight}
          iconSrc={iconSrc}
          width={mapWidth}
          coordinates={center}
        />
      ) : (
        <StyledMap mapOptions={options}>
          <StyledMarker args={[center]} options={{ icon: markerIcon }} />
        </StyledMap>
      )}
      <LocationDescription>
        {iconSrc && (
          <StyledImg
            data-testid="typeIcon"
            alt=""
            src={iconSrc}
            height={iconSize}
            width={iconSize}
          />
        )}
        <div>
          {selection && (
            <div data-testid="assetSelectSummaryDescription">
              {summaryDescription}
            </div>
          )}
          <div data-testid="assetSelectSummaryAddress">{summaryAddress}</div>
        </div>
      </LocationDescription>
      {edit && (
        <StyledLink
          data-testid="mapEditButton"
          onClick={edit}
          onKeyUp={onKeyUp}
          variant="inline"
          tabIndex={0}
        >
          Wijzigen
        </StyledLink>
      )}
    </Wrapper>
  )
}

export default Summary
