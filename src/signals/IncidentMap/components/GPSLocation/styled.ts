// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ViewerContainer from 'components/ViewerContainer'

import { DrawerState } from '../DrawerOverlay'
import { MENU_WIDTH } from '../DrawerOverlay/styled'

export const StyledViewerContainer = styled(ViewerContainer)<{
  $hasPanel: DrawerState
}>`
  position: relative;
  z-index: 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    transition: left 0.25s ease-in-out;
    left: ${({ $hasPanel }) =>
      $hasPanel === DrawerState.Open ? `${MENU_WIDTH}px` : 0};
    margin-left: 16px;
  }
`
