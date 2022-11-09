// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Header = styled(Heading)`
  margin-top: ${themeSpacing(5)};
`

export const StyledParagraph = styled(Paragraph)`
  font-size: ${themeSpacing(4)};
  line-height: ${themeSpacing(6)};
  margin-top: ${themeSpacing(5)};
`

export const ButtonWrapper = styled.div`
  button:first-child {
    margin-right: ${themeSpacing(4)};
  }
`
