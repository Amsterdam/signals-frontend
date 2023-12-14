// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import { Label, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import InfoText from 'components/InfoText'

export const StyledInfoText = styled(InfoText)`
  margin: ${themeSpacing(2, 0, 0)};
`

export const StyledLabel = styled(Label)`
  > span {
    margin-top: 0;
  }
`

export const StyledRadioLabel = styled(Label)`
  align-self: baseline;

  * {
    font-weight: normal;
  }
`
