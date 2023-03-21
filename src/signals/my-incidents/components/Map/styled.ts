// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import CloseButton from 'components/CloseButton'

import MapDetail from '../../../../components/MapDetail'

export const StyledMapViewer = styled.div`
  position: relative;
  top: ${themeSpacing(5)};
  width: 100%;
`

export const StyledCloseButton = styled(CloseButton)`
  z-index: 400;
  top: 16px;
  right: 0;
`

export const StyledMapDetail = styled(MapDetail)`
  height: 450px;
  width: 100%;
`
