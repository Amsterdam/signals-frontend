// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { HEADER_HEIGHT_DESKTOP, HEADER_HEIGHT_MOBILE } from './constants'

export const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  height: ${themeSpacing(HEADER_HEIGHT_DESKTOP)};
  width: 100%;
  background-color: ${themeColor('tint', 'level1')};
  box-shadow: ${themeSpacing(0, 0, 0, 1)} rgba(0, 0, 0, 0.1);
  // z-index relative to map
  z-index: 1;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    height: ${themeSpacing(HEADER_HEIGHT_MOBILE)};
  }
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: ${themeSpacing(4)};

  img {
    height: 100%;
    max-width: 90px;
  }
`
