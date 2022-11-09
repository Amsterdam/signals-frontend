// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'
import Input from 'components/Input'

export const StyledInput = styled(Input)`
  margin-bottom: ${themeSpacing(6)};
  max-width: 300px;
`

export const StyledErrorMessage = styled(ErrorMessage)`
  margin-bottom: ${themeSpacing(2)};
`

export { ErrorWrapper }
