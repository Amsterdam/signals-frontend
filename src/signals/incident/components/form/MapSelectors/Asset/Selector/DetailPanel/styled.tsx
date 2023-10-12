// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022-2023 Gemeente Amsterdam
import { Button, themeSpacing, themeColor, breakpoint } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import { DETAIL_PANEL_WIDTH } from '../../../constants'
import AssetList from '../../AssetList'
import LegendPanel from '../LegendPanel'
import LegendToggle from '../LegendToggleButton'
import { ScrollWrapper } from '../styled'

export const StyledAssetList = styled(AssetList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(4)} 0;
`

export const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
  font-family: inherit;
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

export const PanelContent = styled.div<{
  $noFeatureTypes?: boolean
  $address?: boolean
}>`
  background-color: white;
  padding: ${themeSpacing(4)};
  z-index: 1;
  position: relative;

  // version with adress, and without if small panel then adjust padding, remove margin top inner button and add height

  @media only screen and ${breakpoint('min-width', 'tabletM')} {
    box-shadow: 2px 0 2px rgba(0, 0, 0, 0.1);
    flex: 0 0 ${DETAIL_PANEL_WIDTH}px;
    height: 100vh;
  }

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    bottom: 0;
    box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.1);
    flex: 0 0 40%;
    max-height: 40%;
    order: 1;
    width: 100vw;

    ${({ $noFeatureTypes, $address }) => {
      if (!$address) {
        return css`
          padding: 0;
          flex: 0 0 0;
          height: 0;
        `
      }

      // when no noFeatureTypes
      if ($noFeatureTypes && $address) {
        return css`
          flex: 0 0 0;
          padding: ${themeSpacing(4)};

          ${ScrollWrapper} {
            padding: 0;
            margin: 0;

            ${StyledButton} {
              margin: 0;
            }
          }
        `
      }
    }}
  }
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

export const StyledLabelPDOkAutoSuggest = styled.label`
  display: block;
  font-weight: 700;
`
