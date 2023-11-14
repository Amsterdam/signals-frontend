import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import PDOKAutoSuggest from 'components/PDOKAutoSuggest'

/**
 * AddressLocation
 * */

export const StyledPDOKAutoSuggest = styled(PDOKAutoSuggest)`
  width: 100%;
`

export const AddressLocationWrapper = styled.div`
  width: 100%;
  margin-bottom: ${themeSpacing(4)};
`

/**
 * AddressSearchMobile
 * */

export const AddressSearchWrapper = styled.div`
  padding: ${themeSpacing(2, 4, 4, 4)};
  background-color: white;
  z-index: 1;
  width: 100%;
`

export const OptionsList = styled.div`
  ul {
    margin: ${themeSpacing(2, 0)};
    position: relative;
    background-color: transparent;

    li {
      line-height: 22px;
      padding: ${themeSpacing(2, 0)};
      border: none;
    }
  }

  .chrevronIcon {
    display: none;
  }
`
