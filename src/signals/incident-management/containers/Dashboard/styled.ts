// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { MENU_BREAKPOINT } from 'components/SiteHeader/index'

export const StyledRow = styled.div`
  width: 100%;
  background-color: ${themeColor('tint', 'level2')};
  margin: 0;
`

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 60px;

  @media screen and (min-width: ${MENU_BREAKPOINT + 1}px) {
    flex-direction: row;
  }
`
