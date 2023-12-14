// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import InfoText from 'components/InfoText'

export const StyledInfoText = styled(InfoText)`
  margin: ${themeSpacing(2, 0, 0)};
`

export const StyledSelect = styled.div`
  max-width: 420px;

  strong {
    font-size: 1rem;
  }
`
