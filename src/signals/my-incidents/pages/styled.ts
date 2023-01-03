// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {
  breakpoint,
  Heading,
  Link,
  Paragraph,
  Row,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledRow = styled(Row)`
  max-width: 960px;
  padding: 0 ${themeSpacing(4)};
`

export const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(8, 0, 5, 0)};
  font-size: 1.5rem;
  line-height: 28px;

  @media ${breakpoint('max-width', 'tabletS')} {
    margin: ${themeSpacing(6, 0, 4, 0)};
  }
`

export const ContentWrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 8fr 4fr;
  grid-column-gap: ${themeSpacing(5)};

  @media ${breakpoint('max-width', 'tabletS')} {
    grid-template-columns: 1fr;
    grid-row-gap: ${themeSpacing(4)};
  }
`

export const StyledParagraph = styled(Paragraph)`
  font-size: 1rem;
  line-height: ${themeSpacing(6)};
  margin: ${themeSpacing(5, 0, 5, 0)};

  @media ${breakpoint('max-width', 'tabletS')} {
    margin: ${themeSpacing(4, 0, 4, 0)};
  }
`

export const ButtonWrapper = styled.div`
  margin-top: ${themeSpacing(6)};
  button:first-child {
    margin-right: ${themeSpacing(4)};
  }
`

export const StyledEmail = styled(Paragraph)`
  color: ${themeColor('tint', 'level5')};
  font-weight: 700;
  margin-bottom: ${themeSpacing(4)};
`

export const StyledLink = styled(Link)`
  font-size: 1rem;
  margin-bottom: ${themeSpacing(10)};
`

export const Wrapper = styled.div`
  width: 100%;
`
