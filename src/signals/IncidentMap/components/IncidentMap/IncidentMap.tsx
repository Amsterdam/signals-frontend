// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { useEffect, useState } from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import type { FeatureCollection } from 'geojson'

import { useFetch } from 'hooks'
import configuration from 'shared/services/configuration/configuration'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { MapMessage } from 'signals/incident/components/form/MapSelectors/components/MapMessage'
import type { Bbox } from 'signals/incident/components/form/MapSelectors/hooks/useBoundingBox'

import type { Filter, Point, Properties } from '../../types'
import { FilterPanel } from '../FilterPanel'
import { IncidentLayer } from '../IncidentLayer'
import { Wrapper, Container, StyledMap } from './styled'

export const IncidentMap = () => {
  const [bbox, setBbox] = useState<Bbox | undefined>(undefined)
  const [mapMessage, setMapMessage] = useState<string>('')
  const [filters, setFilters] = useState<Filter[]>([])

  const { get, data, error } = useFetch<FeatureCollection<Point, Properties>>()

  useEffect(() => {
    if (!bbox) return

    const { west, south, east, north } = bbox
    const searchParams = new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })

    get(`${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`)
  }, [get, bbox])

  useEffect(() => {
    /**
     * TODO: Filter data based on selected filters
     * and pass them to the incident layer
     */
  }, [data, filters])

  useEffect(() => {
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      return
    }
  }, [error])

  return (
    <Wrapper>
      <Container>
        <StyledMap
          data-testid="incidentMap"
          hasZoomControls
          fullScreen
          mapOptions={{ ...MAP_OPTIONS, zoom: 9, attributionControl: false }}
        >
          <IncidentLayer passBbox={setBbox} incidents={data?.features} />

          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            setMapMessage={setMapMessage}
          />

          {mapMessage && (
            <ViewerContainer
              topLeft={
                <MapMessage onClick={() => setMapMessage('')}>
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
