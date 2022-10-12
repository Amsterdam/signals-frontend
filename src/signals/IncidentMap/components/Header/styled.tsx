// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { HEADER_HEIGHT_DESKTOP, HEADER_HEIGHT_MOBILE } from './constants'

export const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  height: ${themeSpacing(HEADER_HEIGHT_DESKTOP)};
  width: 100%;
  padding: 0 ${themeSpacing(4)};
  background-color: ${themeColor('tint', 'level1')};
  box-shadow: ${themeSpacing(0, 0, 0, 1)} rgba(0, 0, 0, 0.1);
  // z-index relative to map
  z-index: 1;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    height: ${themeSpacing(HEADER_HEIGHT_MOBILE)};
    padding: ${themeSpacing(0, 0, 0, 4)};
  }
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  img {
    height: 100%;
    max-width: 90px;
  }
`
