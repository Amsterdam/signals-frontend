// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ErrorMessage from 'components/ErrorMessage'

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(2)};
`

export const StyledP = styled.p`
  line-height: 1.5rem;
  max-height: 6rem;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
`
