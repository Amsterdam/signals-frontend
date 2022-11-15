// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { breakpoint, Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(8, 0, 5, 0)};
  font-size: 24px;
  line-height: 28px;

  @media ${breakpoint('max-width', 'tabletS')} {
    margin: ${themeSpacing(6, 0, 4, 0)};
  }
`

export const ContentWrapper = styled.div`
  box-sizing: border-box;
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 8fr 4fr;
  grid-column-gap: ${themeSpacing(5)};

  @media ${breakpoint('max-width', 'tabletS')} {
    grid-template-columns: 1fr;
    grid-row-gap: ${themeSpacing(8)};
    margin: ${themeSpacing(0, 4)};
  }
`

export const StyledParagraph = styled(Paragraph)`
  font-size: ${themeSpacing(4)};
  line-height: ${themeSpacing(6)};
  margin: ${themeSpacing(5, 0, 4, 0)};
`

export const ButtonWrapper = styled.div`
  button:first-child {
    margin-right: ${themeSpacing(4)};
  }
`
