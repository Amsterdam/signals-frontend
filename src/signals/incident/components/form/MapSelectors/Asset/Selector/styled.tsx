import styled from 'styled-components'
import {
  breakpoint,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'

import Map from 'components/Map'
import ViewerContainer from 'components/ViewerContainer'
import { DETAIL_PANEL_WIDTH } from '../../constants'

export const StyledViewerContainer = styled(ViewerContainer)`
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    left: ${DETAIL_PANEL_WIDTH}px;
  }
  z-index: 0;
`

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box; // Override box-sizing: content-box set by Leaflet
  z-index: 2; // position over the site header
  display: flex;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    flex-direction: column;
  }
`

export const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 0;
`

export const TopLeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${themeSpacing(4)};
`

export const ScrollWrapper = styled.div.attrs({
  'data-scroll-lock-scrollable': true,
})`
  -webkit-overflow-scrolling: touch;
  height: 100%;
  overflow-y: auto;
  padding: ${themeSpacing(4, 0, 10)};
`

export const Title = styled(Paragraph).attrs({
  styleAs: 'h1',
})`
  margin: ${themeSpacing(-4, -4, 0)};
  padding: ${themeSpacing(3, 4)};

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    border-bottom: 1px solid ${themeColor('tint', 'level3')};
  }
`
