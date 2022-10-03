import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import PDOKAutoSuggest from 'components/PDOKAutoSuggest/PDOKAutoSuggest'

export const StyledPDOKAutoSuggest = styled(PDOKAutoSuggest)`
  width: 100%;
`

export const Wrapper = styled.div`
  width: 100%;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    padding: 20px;
  }
`
