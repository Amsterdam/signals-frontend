import styled from 'styled-components'
import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'

import Map from 'components/Map'
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

  //                  left page margin + gps button width + margin to gps button + margin to close button + close button width + right page margin
  width: calc(100vw - (16px + 44px + 16px + 16px + 44px + 16px));

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: 50vw;
    max-width: 375px;
  }
`

export const ControlWrapper = styled.div`
  display: flex;

  * + * {
    margin-left: 8px;
  }
`

export const TopLeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${themeSpacing(4)};
`
