// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import {
  Heading,
  Link,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledParagraph = styled(Paragraph)`
  font-size: 16px;
  line-height: ${themeSpacing(6)};
  margin-top: ${themeSpacing(5)};
`

export const ButtonWrapper = styled.div`
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
  font-size: 16px;
  margin-bottom: ${themeSpacing(10)};
`

export const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(5)} 0;
`

export const Wrapper = styled.div`
  width: 100%;
`
