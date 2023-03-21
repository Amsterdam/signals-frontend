// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Alert, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Markdown from '../Markdown'

export const StyledAlert = styled(Alert)`
  margin: ${themeSpacing(5, 0)};
`

export const StyledMarkdown = styled(Markdown)`
  p {
    color: ${themeColor('secondary')};
  }
`
