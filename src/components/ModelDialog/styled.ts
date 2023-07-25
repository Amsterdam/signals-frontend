// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Modal, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import FormFooter from '../FormFooter'

export const StyledModal = styled(Modal)`
  overflow: hidden;
  min-height: 200px;
  height: auto;
  display: flex;
  flex-direction: column;
`
export const StyledFormFooter = styled(FormFooter)`
  margin-left: ${themeSpacing(4)};
  margin-bottom: ${themeSpacing(4)};
  padding: 0;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  height: auto;
`
