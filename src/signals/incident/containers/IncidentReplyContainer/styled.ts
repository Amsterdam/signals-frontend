import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Content = styled.div`
  flex-direction: column;
`

export const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`
