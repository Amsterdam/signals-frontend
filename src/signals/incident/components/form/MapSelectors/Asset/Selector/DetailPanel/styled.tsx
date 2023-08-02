// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Button, themeSpacing, themeColor, breakpoint } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import PDOKAutoSuggest from 'components/PDOKAutoSuggest'

import { DETAIL_PANEL_WIDTH } from '../../../constants'
import AssetList from '../../AssetList'
import LegendPanel from '../LegendPanel'
import LegendToggle from '../LegendToggleButton'

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

export const PanelContent = styled.div<{ smallViewport?: boolean }>`
  background-color: white;
  padding: ${themeSpacing(4)};
  z-index: 1;
  position: relative;
  ${({ smallViewport }) =>
    smallViewport &&
    css`
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
    `}

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    bottom: 0;
    box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.1);
    flex: 0 0 50%;
    max-height: 50%;
    order: 1;
    width: 100vw;
  }

  @media only screen and ${breakpoint('min-width', 'tabletM')} {
    box-shadow: 2px 0 2px rgba(0, 0, 0, 0.1);
    flex: 0 0 ${DETAIL_PANEL_WIDTH}px;
    height: 100vh;
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

export const StyledPDOKAutoSuggest = styled(PDOKAutoSuggest)`
  margin: ${themeSpacing(4, 0)};
  width: 100%;
`

export const AddressPanel = styled.article`
  background-color: white;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  left: 0;
  top: 0;

  header {
    border-bottom: 5px solid rgba(0, 0, 0, 0.1);
    padding: ${themeSpacing(4)};
    display: flex;
    align-items: center;

    > * {
      margin: 0;
    }

    > button {
      border: 0;
      margin-right: ${themeSpacing(4)};
    }
  }

  .instruction {
    color: ${themeColor('tint', 'level4')};
    font-size: 1.125rem;
    margin-top: ${themeSpacing(6)};
    text-align: center;
  }
`

export const OptionsList = styled.div`
  ul {
    border: 0;
    margin: ${themeSpacing(2, 0)};

    li {
      line-height: 22px;
      padding: ${themeSpacing(2, 4)};
    }
  }

  .chrevronIcon {
    display: none;
  }
`
