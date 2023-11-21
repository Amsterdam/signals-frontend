import {
  breakpoint,
  Heading,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import Map from 'components/Map'
import PDOKAutoSuggest from 'components/PDOKAutoSuggest'
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
export const StyledLabel = styled.label`
  font-weight: 700;
  line-height: 1.5rem;
`

export const StyledPDOKAutoSuggest = styled(PDOKAutoSuggest)`
  margin: ${themeSpacing(2, 0, 0, 0)};
  width: 100%;
`

export const AddressPanel = styled.article`
  background-color: white;
  position: absolute;
  width: 100vw;
  z-index: 2;
  left: 0;
  top: 0;

  .instruction {
    color: ${themeColor('tint', 'level4')};
    font-size: 1.125rem;
    margin-top: ${themeSpacing(6)};
    text-align: center;
  }
`

export const StyledHeader = styled.header<{ $smallView: boolean }>`
  position: relative;
  padding: ${themeSpacing(4, 4, 4, 2.5)};
  display: flex;

  ${({ $smallView }) =>
    $smallView &&
    `
      align-items: center;

  `}

  ${StyledPDOKAutoSuggest} {
    margin: ${themeSpacing(1.5, 0, 0, 0)};

    ${({ $smallView }) =>
      $smallView &&
      css`
        margin: ${themeSpacing(0)};
      `}
    }
  }
`

export const InputGroup = styled.div`
  flex-grow: 1;
  margin-left: ${themeSpacing(2)};
`

export const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 0;
`

export const TopLeftWrapper = styled.div<{ maxAssets: boolean }>`
  display: flex;
  flex-direction: column;
  margin-right: ${themeSpacing(4)};

  > * {
    margin-bottom: ${themeSpacing(2)};
  }

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    position: absolute;
    top: unset;
    left: ${themeSpacing(4)};
    bottom: -${themeSpacing(16)};

    > * {
      margin-bottom: unset;
      height: 44px;
    }

    ${({ maxAssets }) =>
      maxAssets &&
      css`
        bottom: -${themeSpacing(31)};

        > *:first-child {
          margin-bottom: ${themeSpacing(4)};
        }
      `}
`

export const ScrollWrapper = styled.div.attrs({
  'data-scroll-lock-scrollable': true,
})`
  -webkit-overflow-scrolling: touch;
`

export const Title = styled(Heading)`
  margin: ${themeSpacing(-4, -4, 0)};
  padding: ${themeSpacing(3, 4)};

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    border-bottom: 1px solid ${themeColor('tint', 'level3')};
  }
`

export const OptionsList = styled.div`
  ul {
    border: 0;

    li {
      line-height: 22px;
      padding: ${themeSpacing(2, 4)};
    }
  }

  .chrevronIcon {
    display: none;
  }
`
