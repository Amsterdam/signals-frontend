// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ViewerContainer from 'components/ViewerContainer'

export const StyledViewerContainer = styled(ViewerContainer)`
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    left: 480px; //width of the sidePanel that needs to be build
  }
  z-index: 1;
`
