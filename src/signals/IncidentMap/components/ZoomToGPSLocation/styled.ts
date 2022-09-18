// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import styled from 'styled-components'
import ViewerContainer from 'components/ViewerContainer'
import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'

export const StyledViewerContainer = styled(ViewerContainer)`
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    left: 480px;
  }
  z-index: 1;
`
export const TopLeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${themeSpacing(4)};
`
