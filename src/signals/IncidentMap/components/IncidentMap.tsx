// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import styled from 'styled-components'
import Map from 'components/Map'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import IncidentLayer from './IncidentLayer'

const Wrapper = styled.div`
  position: absolute;
  top: 65px; // to leave room for the heading
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100% - 65px);
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
      mapOptions={{ ...MAP_OPTIONS, zoom: 9 }}
    >
      <IncidentLayer />
    </StyledMap>
  </Wrapper>
)

export default IncidentMap
