// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { PanelContent } from 'signals/incident/components/form/MapSelectors/Asset/Selector/DetailPanel/styled'
import { breakpoint, Label, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledPanelContent = styled(PanelContent)`
  padding: ${themeSpacing(10)} ${themeSpacing(5)};
  height: 100%;
  flex: 0 0 33%;
  box-shadow: ${themeSpacing(1)} 0 ${themeSpacing(1)} 0 rgba(0, 0, 0, 0.1);
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    box-shadow: 0 -${themeSpacing(1)} ${themeSpacing(1)} rgba(0, 0, 0, 0.1);
  }
`

export const StyledLabel = styled(Label)`
  font-weight: normal;
`

export const CategoryFilter = styled.div`
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(1)} 0;
`

export const Wrapper = styled.div`
  border-top: 1px solid ${themeColor('tint', 'level3')};
`
