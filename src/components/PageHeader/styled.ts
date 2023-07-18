import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const StyledSection = styled.section<{ hasBackLink: boolean }>`
  contain: content;
  padding-top: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(3)};
  margin-bottom: ${themeSpacing(5)};

  ${({ hasBackLink }) =>
    hasBackLink &&
    css`
      h1 {
        margin-top: ${themeSpacing(3)};
      }
    `}
`

export const StyledHeading = styled(Heading)`
  margin: 0;
  line-height: 44px;
`

export const StyledHeadingWrapper = styled.div`
  flex-basis: 100%;
`
