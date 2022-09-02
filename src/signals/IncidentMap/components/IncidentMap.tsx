// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import styled from 'styled-components'
import Map from 'components/Map'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import type { ReactElement } from 'react'
import type { FeatureCollection } from 'geojson'
import type { LatLngTuple } from 'leaflet'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import { useEffect, useState } from 'react'
import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import { ViewerContainer } from '@amsterdam/arm-core'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import { breakpoint, Button, themeSpacing } from '@amsterdam/asc-ui'
import { ChevronLeft, ChevronRight } from '@amsterdam/asc-assets'
import IncidentLayer from './IncidentLayer'
import FilterCategoryPanel from './FilterCategoryPanel'
import type { FilterCategory } from './FilterCategoryPanel'

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

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    flex-direction: column;
  }
`

const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
  z-index: 0;
`

const StyledButton = styled(Button)`
  position: absolute;
  top: ${themeSpacing(5)};
  left: calc(33% - ${themeSpacing(2)});
  z-index: 3;
  width: ${themeSpacing(9)};
  box-shadow: ${themeSpacing(1)} ${themeSpacing(1)} ${themeSpacing(1)}
    rgba(0, 0, 0, 0.1);
  &.hiddenPanel {
    left: 0;
  }
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    transform: rotate(-90deg);
    top: calc(50% - ${themeSpacing(3)});
    left: calc(50% - 18px);
    box-shadow: ${themeSpacing(0)} ${themeSpacing(0)} ${themeSpacing(0)}
      rgba(0, 0, 0, 0.1);
    &.hiddenPanel {
      left: calc(50% - 18px);
      top: calc(100% - ${themeSpacing(11)});
      box-shadow: ${themeSpacing(1)} ${themeSpacing(1)} ${themeSpacing(1)}
        rgba(0, 0, 0, 0.1);
    }
  }
`

export type Point = {
  type: 'Point'
  coordinates: LatLngTuple
}

export type Properties = {
  category: {
    name: string
  }
  created_at: string
}

const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>(undefined)
  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>()
  const [showIncidentLayer, setShowIncidentLayer] = useState<boolean>(true)
  const [showPanel, setShowPanel] = useState<boolean>(true)

  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()

  useEffect(() => {
    if (!bbox || !filterCategories) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })

    let mainCategoryParam = ''
    const activeCategories = filterCategories?.filter(
      ({ filterActive }) => filterActive
    )

    /* When all category filters are off (i.e., there are no activeCategories), no incidents should be shown on the map.
    However, when the request has no 'maincategory_slug' in its params, all incidents are returned.
    Therefore, the incident layer is not shown in this case. */
    if (activeCategories.length === 0) {
      setShowIncidentLayer(false)
      return
    }

    /* When not all category filters are on, the category slug needs to be added to the params of the request.
    It is not possible to use URLSearchParams for this because it does not accept the same param more than once. */
    if (activeCategories.length < filterCategories?.length) {
      mainCategoryParam = activeCategories.reduce(
        (result, category) => result + `&maincategory_slug=${category.slug}`,
        ''
      )
    }

    get(
      `${
        configuration.GEOGRAPHY_PUBLIC_ENDPOINT
      }?${searchParams.toString()}${mainCategoryParam}`
    )
    setShowIncidentLayer(true)
  }, [get, bbox, filterCategories, setShowIncidentLayer])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      return
    }
  }, [error])

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [showPanel])

  return (
    <Wrapper>
      <Container>
        {showPanel && (
          <FilterCategoryPanel passFilterCategories={setFilterCategories} />
        )}
        <StyledMap
          data-testid="incidentMap"
          hasZoomControls
          fullScreen
          mapOptions={{ ...MAP_OPTIONS, zoom: 9, attributionControl: false }}
        >
          {showIncidentLayer && (
            <IncidentLayer passBbox={setBbox} incidents={data?.features} />
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
          <StyledButton
            className={showPanel ? '' : 'hiddenPanel'}
            onClick={() => setShowPanel(!showPanel)}
            size={60}
            variant="blank"
            iconSize={24}
            icon={showPanel ? <ChevronLeft /> : <ChevronRight />}
          />
        </StyledMap>
      </Container>
    </Wrapper>
  )
}

export default IncidentMap
