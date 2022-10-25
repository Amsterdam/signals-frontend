import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import styled, { keyframes } from 'styled-components'

import PDOKAutoSuggest from 'components/PDOKAutoSuggest'

/**
 * AddressLocation
 * */

export const StyledPDOKAutoSuggest = styled(PDOKAutoSuggest)`
  width: 100%;
`

export const AddressLocationWrapper = styled.div`
  width: 100%;
  margin: ${themeSpacing(5, 0)};

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-top: ${themeSpacing(0)};
  }
`

/**
 * AddressSearchMobile
 * */

export const AddressSearchWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  background-color: white;
  z-index: 100;
`

const slideUp = keyframes`
  from {
    transform: translate3d(0, 100%, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`

export const AddressSearch = styled.article`
  background-color: white;
  position: fixed;
  width: 100vw;
  height: 100%;
  z-index: 2;
  left: 0;
  top: 0;
  animation: ${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1) translate3d(0, 50%, 0);

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    transform: translate3d(0, 0, 0);
  }

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
