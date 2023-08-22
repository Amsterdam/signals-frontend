// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback } from 'react'
import type { FC, KeyboardEvent } from 'react'

import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { Marker } from '@amsterdam/react-maps'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Map from 'components/Map'
import configuration from 'shared/services/configuration/configuration'
import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { formatAddress } from 'shared/services/format-address'
import type { SummaryProps } from 'signals/incident/components/form/MapSelectors/Asset/types'
import {
  NEARBY_TYPE,
  selectionIsUndetermined,
} from 'signals/incident/components/form/MapSelectors/constants'
import type {
  FeatureType,
  Item,
} from 'signals/incident/components/form/MapSelectors/types'
import { showMap } from 'signals/incident/containers/IncidentContainer/actions'

import onButtonPress from '../../utils/on-button-press'

const mapWidth = 640
const mapHeight = 180
const iconSize = 40

const Wrapper = styled.div`
  position: relative;
  margin: ${themeSpacing(0, 0, 0, 0)};
`

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 1rem;
  cursor: pointer;
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
    zoom: configuration.map.optionsSummaryMap.zoom,
    attributionControl: false,
    center,
  }

  const { pathname } = useLocation()
  const atFinalSummary = pathname.includes('summary')

  let summaryAddress = address ? formatAddress(address) : ''
  summaryAddress =
    !summaryAddress && coordinates
      ? 'Locatie is gepind op de kaart'
      : summaryAddress

  const dispatch = useDispatch()

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>) => {
      onButtonPress(event, () => dispatch(showMap()))
    },
    [dispatch]
  )

  return (
    <Wrapper data-testid="asset-select-summary">
      <StyledMap mapOptions={options}>
        <StyledMarker
          args={[center]}
          options={{ icon: markerIcon, keyboard: false }}
        />
      </StyledMap>

      <Address data-testid="asset-select-summary-address">
        {summaryAddress}
      </Address>

      <div>
        {selection?.map((item) => {
          const { id, type } = item || {}

          const summaryDescription =
            type !== NEARBY_TYPE ? item.label : undefined
          const iconSrc = getIconSrc(item, featureTypes)

          return (
            <LocationDescription key={`${id}-address`}>
              {getIconSrc(item, featureTypes) && (
                <StyledImg
                  data-testid="type-icon"
                  alt={item.label}
                  src={iconSrc}
                  height={iconSize}
                  width={iconSize}
                />
              )}
              <div>
                {selection && (
                  <div data-testid="asset-select-summary-description">
                    {summaryDescription}
                  </div>
                )}
              </div>
            </LocationDescription>
          )
        })}
      </div>
      {!atFinalSummary && (
        <StyledLink
          data-testid="map-edit-button"
          onClick={() => dispatch(showMap())}
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
