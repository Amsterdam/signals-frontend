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
import IncidentLayer from './IncidentLayer'

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

const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
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
    if (error) {
      setMapMessage('Er konden geen meldingen worden opgehaald.')
      return
    }
  }, [error])

  return (
    <Wrapper>
      <StyledMap
        data-testid="incidentMap"
        hasZoomControls
        fullScreen
        mapOptions={{
          ...MAP_OPTIONS,
          zoom: 9,
          dragging: true,
          attributionControl: false,
          scrollWheelZoom: true,
        }}
      >
        <IncidentLayer passBbox={setBbox} incidentData={data} />
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
    </Wrapper>
  )
}

export default IncidentMap
