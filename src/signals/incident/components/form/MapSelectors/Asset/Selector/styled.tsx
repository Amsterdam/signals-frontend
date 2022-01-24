import styled from 'styled-components'
import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'

import Map from 'components/Map'
import MapCloseButton from 'components/MapCloseButton'
import PDOKAutoSuggest from 'components/PDOKAutoSuggest'
import ViewerContainer from 'components/ViewerContainer'

export const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 401;
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
`

export const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 0;
`

export const StyledPDOKAutoSuggest = styled(PDOKAutoSuggest)`
  position: relative;
  z-index: 1;

  left: calc(44px + 8px);
  //                  gps button width + left margin + right margin + margin to gps button - border width
  width: calc(100vw - (44px + 16px + 16px + 8px - 2px));

  @media screen and ${breakpoint('min-width', 'tabletS')} {
    //                  gps button width + close button width + margin to gps button + left margin + right margin
    width: calc(100vw - (44px + 44px + 8px + 16px + 16px + 8px));
  }

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 50vw;
    max-width: 375px;
  }
`

export const CloseButton = styled(MapCloseButton)`
  @media screen and ${breakpoint('max-width', 'tabletS')} {
    margin-top: ${themeSpacing(11)};
  }
`
