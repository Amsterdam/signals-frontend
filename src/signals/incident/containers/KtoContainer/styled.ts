// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Heading, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(6)};
`

export const StyledParagraph = styled(Paragraph)`
  margin-top: ${themeSpacing(5)};
  white-space: pre-line;
`
