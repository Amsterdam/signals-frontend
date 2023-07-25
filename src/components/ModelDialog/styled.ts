// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Modal, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import { HEIGHTOFFORMFOOTER } from './constants'
import FormFooter from '../FormFooter'

export const StyledModal = styled(Modal)`
  overflow: hidden;
  min-height: 200px;
  height: auto;
`
export const StyledFormFooter = styled(FormFooter)`
  box-sizing: border-box;
  bottom: 0;
  position: fixed;
  height: ${HEIGHTOFFORMFOOTER}px;
  padding-left: ${themeSpacing(4)};
`
