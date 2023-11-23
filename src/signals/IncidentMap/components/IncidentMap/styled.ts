// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { breakpoint, themeSpacing, Paragraph } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { DrawerState } from 'components/DrawerOverlay'
import { MENU_WIDTH } from 'components/DrawerOverlay/styled'
import Map from 'components/Map'
import ViewerContainer from 'components/ViewerContainer'

import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
} from '../Header/constants'

export const Wrapper = styled.div`
  position: absolute;
  top: ${themeSpacing(HEADER_HEIGHT_DESKTOP)};
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100% - ${themeSpacing(HEADER_HEIGHT_DESKTOP)});
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row-reverse;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    flex-direction: column;
    height: calc(100% - ${themeSpacing(HEADER_HEIGHT_MOBILE)});
    top: ${themeSpacing(HEADER_HEIGHT_MOBILE)};
  }
`

export const StyledMap = styled(Map)`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
`

export const StyledParagraph = styled(Paragraph)`
  margin: ${themeSpacing(2, 0, 5, 0)};
  line-height: inherit;
`

export const TopLeftWrapper = styled.div`
  align-items: left;

  > :first-child {
    margin-bottom: ${themeSpacing(2)};
  }
`

export const StyledViewerContainer = styled(ViewerContainer)<{
  $hasPanel: DrawerState
}>`
  position: relative;
  z-index: 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    transition: left 0.25s ease-in-out;
    left: ${({ $hasPanel }) =>
      $hasPanel === DrawerState.Open ? `${MENU_WIDTH}px` : 0};
    margin-left: ${themeSpacing(4)};
  }
`
