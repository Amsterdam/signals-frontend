// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { Heading, Row, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import MapDetail from 'components/MapDetail'
import configuration from 'shared/services/configuration/configuration'
import { markerIcon } from 'shared/services/configuration/map-markers'

import ExplanationSection from './components/ExplanationSection'

export const Wrapper = styled.div`
  flex-direction: column;
  width: 100%;
`

export const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

export const StyledExplanationSection = styled(ExplanationSection)`
  margin-bottom: ${themeSpacing(1)};
`

export const MapRow = styled(Row)`
  position: relative;
`

export const Map = styled(MapDetail).attrs({
  canFocusMarker: false,
  hasZoomControls: true,
  icon: markerIcon,
  zoom: configuration.map.optionsExternalReplyMap.zoom,
})`
  width: 100%;
  height: 500px;
  margin-top: ${themeSpacing(5)};
  z-index: 1;
`

export const QuestionnaireRow = styled(Row)<{
  hidden?: boolean
}>`
  ${({ hidden }) => hidden && 'display: none;'}
`
