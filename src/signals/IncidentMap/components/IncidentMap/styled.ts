// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Map from 'components/Map'

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
  height: 100%;
  width: 100%;
  z-index: 1;
`
