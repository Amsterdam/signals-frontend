// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { Marker } from '@amsterdam/react-maps'

import type { FC, KeyboardEvent } from 'react'

import MapStatic from 'components/MapStatic'
import Map from 'components/Map'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { markerIcon } from 'shared/services/configuration/map-markers'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { formatAddress } from 'shared/services/format-address'
import configuration from 'shared/services/configuration/configuration'

const mapWidth = 640
const mapHeight = 180
const mapZoom = 12

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

const Summary: FC = () => {
  const { address, coordinates, selection, edit, meta } =
    useContext(AssetSelectContext)
  const { id, type } = selection || {}
  const { description } =
    meta.featureTypes.find(({ typeValue }) => typeValue === type) ?? {}

  const options = {
    ...MAP_OPTIONS,
    zoom: mapZoom,
    attributionControl: false,
    center: coordinates,
  }

  const summaryDescription = [description, id].filter(Boolean).join(' - ')
  let summaryAddress = coordinates ? 'Locatie is gepind op de kaart' : ''
  if (address) summaryAddress = formatAddress(address)

  const iconSrc = useMemo(() => {
    if (!selection?.type || selection.type === 'not-on-map') {
      return undefined
    }

    const featureType = meta.featureTypes.find(
      ({ typeValue }) => typeValue === selection.type
    )

    return featureType && featureType.icon.iconUrl
  }, [selection?.type, meta.featureTypes])

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event?.key === 'Enter') {
        edit(event)
      }
    },
    [edit]
  )

  return (
    <Wrapper data-testid="assetSelectSummary">
      {coordinates &&
        (configuration.featureFlags.useStaticMapServer ? (
          <StyledMapStatic
            height={mapHeight}
            iconSrc={iconSrc}
            width={mapWidth}
            coordinates={coordinates}
          />
        ) : (
          <StyledMap mapOptions={options}>
            <StyledMarker args={[coordinates]} options={{ icon: markerIcon }} />
          </StyledMap>
        ))}

      {selection && (
        <div data-testid="assetSelectSummaryDescription">
          {summaryDescription}
        </div>
      )}
      <div data-testid="assetSelectSummaryAddress">{summaryAddress}</div>
      <StyledLink
        onClick={edit}
        onKeyUp={onKeyUp}
        variant="inline"
        tabIndex={0}
      >
        Wijzigen
      </StyledLink>
    </Wrapper>
  )
}

export default Summary
