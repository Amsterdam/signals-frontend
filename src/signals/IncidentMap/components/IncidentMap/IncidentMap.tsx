// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import type { Feature, FeatureCollection } from 'geojson'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Filter, Point, Properties } from '../../types'
import { FilterPanel } from '../FilterPanel'
import { IncidentLayer } from '../IncidentLayer'
import { getFilteredIncidents } from '../utils'
import { Wrapper, Container, StyledMap } from './styled'

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>()
  const [mapMessage, setMapMessage] = useState<string>('')
  const [showMessage, setShowMessage] = useState<boolean>(false)
  const [filters, setFilters] = useState<Filter[]>([])
  const [filteredIncidents, setFilteredIncidents] =
    useState<Feature<Point, Properties>[]>()

  const { get, data, error, isSuccess } =
    useFetch<FeatureCollection<Point, Properties>>()

  useEffect(() => {
    if (bbox) {
      const { west, south, east, north } = bbox
      const searchParams = new URLSearchParams({
        bbox: `${west},${south},${east},${north}`,
      })

      get(
        `${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`
      )
    }
  }, [get, bbox])

  useEffect(() => {
    if (data) {
      const filteredIncidents = getFilteredIncidents(filters, data.features)
      setFilteredIncidents(filteredIncidents)
    }
  }, [data, filters])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      setShowMessage(true)
    }
  }, [error, isSuccess])

  return (
    <Wrapper>
      <Container>
        <StyledMap
          data-testid="incidentMap"
          hasZoomControls
          fullScreen
          mapOptions={{ ...MAP_OPTIONS, zoom: 9, attributionControl: false }}
        >
          <IncidentLayer passBbox={setBbox} incidents={filteredIncidents} />

          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            setMapMessage={setMapMessage}
          />

          {mapMessage && showMessage && (
            <ViewerContainer
              topLeft={
                <MapMessage onClick={() => setShowMessage(false)}>
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
