// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import styled from 'styled-components'

import { MENU_BREAKPOINT } from 'components/SiteHeader/index'

export const Wrapper = styled.div`
  width: 100%;

  @media screen and (min-width: ${MENU_BREAKPOINT + 1}px) {
    margin-right: 60px;
  }
`
