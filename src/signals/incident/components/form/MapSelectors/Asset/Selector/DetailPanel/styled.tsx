import styled from 'styled-components'

import { Button, themeSpacing, themeColor, breakpoint } from '@amsterdam/asc-ui'

import AssetList from '../../AssetList'
import LegendToggle from '../LegendToggleButton'
import LegendPanel from '../LegendPanel'
import { DETAIL_PANEL_WIDTH } from '../../../constants'

export const StyledAssetList = styled(AssetList)`
  margin: ${themeSpacing(2)} 0 ${themeSpacing(4)} 0;
`

export const StyledButton = styled(Button)`
  margin-top: ${themeSpacing(6)};
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
  padding: ${themeSpacing(4)};
  position: relative;
  z-index: 1;

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    bottom: 0;
    box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.1);
    flex: 0 0 50vh;
    max-height: 50vh;
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
  font-size: 16px;
  font-weight: 400;
`
