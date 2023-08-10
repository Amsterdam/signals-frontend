// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Modal, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import FormFooter from '../FormFooter'

export const StyledModal = styled(Modal)`
  min-height: 200px;
  display: flex;
  flex-direction: column;
`
export const StyledFormFooter = styled(FormFooter)`
  padding-left: ${themeSpacing(4)};
`
