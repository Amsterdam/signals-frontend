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

const IncidentMap = () => (
  <Wrapper>
    <StyledMap
      data-testid="incidentMap"
      hasZoomControls
      fullScreen
      mapOptions={{
        ...MAP_OPTIONS,
        zoom: 9,
        scrollWheelZoom: true,
        attributionControl: false,
      }}
    >
      <IncidentLayer />
    </StyledMap>
  </Wrapper>
)

export default IncidentMap
