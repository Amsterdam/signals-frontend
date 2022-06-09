// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { useCallback } from 'react'
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
import {
  NEARBY_TYPE,
  selectionIsUndetermined,
} from 'signals/incident/components/form/MapSelectors/constants'
import type { SummaryProps } from 'signals/incident/components/form/MapSelectors/Asset/types'
import { useDispatch } from 'react-redux'
import { showMap } from 'signals/incident/containers/IncidentContainer/actions'
import type {
  FeatureType,
  Item,
} from 'signals/incident/components/form/MapSelectors/types'

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
  margin: ${themeSpacing(0, 0, 3, 0)};
`

const StyledMap = styled(Map)`
  max-width: ${mapWidth}px;
  height: ${mapHeight}px;
  margin: ${themeSpacing(0, 0, 4, 0)};
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

const Address = styled.div`
  margin-bottom: ${themeSpacing(3)};
`

const defaultCenter = {
  lat: configuration.map.options.center[0],
  lng: configuration.map.options.center[1],
}

const getIconSrc = (item: Item, featureTypes: FeatureType[]) => {
  if (!item?.type || selectionIsUndetermined(item)) {
    return undefined
  }

  const featureType = featureTypes.find(
    ({ typeValue }) => typeValue === item.type
  )

  return featureType && featureType.icon.iconUrl
}

const Summary: FC<SummaryProps> = ({
  address,
  coordinates,
  selection,
  featureTypes,
}) => {
  const center = coordinates || defaultCenter

  const options = {
    ...MAP_OPTIONS,
    zoom: mapZoom,
    attributionControl: false,
    center,
  }

  let summaryAddress = address ? formatAddress(address) : ''
  summaryAddress =
    !summaryAddress && coordinates
      ? 'Locatie is gepind op de kaart'
      : summaryAddress

  const dispatch = useDispatch()

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      if (event?.key === 'Enter') {
        dispatch(showMap())
      }
    },
    [dispatch]
  )

  return (
    <Wrapper data-testid="assetSelectSummary">
      {configuration.featureFlags.useStaticMapServer ? (
        <StyledMapStatic
          iconSrc={'/assets/images/icon-select-marker.svg'}
          height={mapHeight}
          width={mapWidth}
          coordinates={center}
        />
      ) : (
        <StyledMap mapOptions={options}>
          <StyledMarker args={[center]} options={{ icon: markerIcon }} />
        </StyledMap>
      )}

      <Address data-testid="assetSelectSummaryAddress">
        {summaryAddress}
      </Address>

      <div>
        {selection?.map((item) => {
          const { id, type } = item || {}
          const { description } =
            featureTypes.find(({ typeValue }) => typeValue === type) ?? {}

          const summaryDescription =
            type !== NEARBY_TYPE
              ? [description, id].filter(Boolean).join(' - ')
              : undefined
          const iconSrc = getIconSrc(item, featureTypes)

          return (
            <LocationDescription key={`${id}-address`}>
              {getIconSrc(item, featureTypes) && (
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
              </div>
            </LocationDescription>
          )
        })}
      </div>
      <StyledLink
        data-testid="mapEditButton"
        onClick={() => dispatch(showMap())}
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
