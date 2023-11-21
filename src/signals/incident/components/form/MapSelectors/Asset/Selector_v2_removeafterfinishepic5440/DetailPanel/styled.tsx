// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022-2023 Gemeente Amsterdam
import { Button, themeSpacing, themeColor, breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { DETAIL_PANEL_WIDTH } from '../../../constants'
import AssetList from '../../AssetList'
import LegendPanel from '../LegendPanel'
import LegendToggle from '../LegendToggleButton'

export const StyledAssetList = styled(AssetList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(16)} 0;
  @media only screen and ${breakpoint('min-width', 'tabletM')} {
    margin: ${themeSpacing(2)} 0 0 0;
  }
`

export const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(5)};
  font-family: inherit;
`

export const StyledButtonWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1;
  padding: ${themeSpacing(5)};
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px -4px 4px 0px;

  ${StyledButton} {
    margin-top: 0;
  }
`

export const LegendToggleButton = styled(LegendToggle)`
  position: absolute;
  z-index: 1;

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    left: 16px;
    top: -60px;
  }

  @media only screen and ${breakpoint('min-width', 'tabletM')} {
    bottom: ${themeSpacing(4)};
    left: calc(${DETAIL_PANEL_WIDTH}px + ${themeSpacing(4)});
  }
`

export const PanelContent = styled.div`
  background-color: white;
  z-index: 1;
  position: relative;
`

export const StyledLegendPanel = styled(LegendPanel)`
  z-index: 2;
`

export const Description = styled.span`
  color: ${themeColor('tint', 'level5')};
  display: block;
  font-size: 1rem;
  font-weight: 400;
`

export const StyledParagraphPDOkAutoSuggest = styled.p`
  font-size: 1.125rem;
  display: block;
  font-weight: 700;
  margin: ${themeSpacing(5, 0, 0, 0)};
`

export const StyledLabelPDOkAutoSuggest = styled.label`
  display: block;
  font-weight: 700;
  margin-top: ${themeSpacing(5)};
`
