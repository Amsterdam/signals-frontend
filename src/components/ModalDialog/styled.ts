// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Modal, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import FormFooter from '../FormFooter'

export const StyledModal = styled(Modal)<{ $hasIframe: boolean }>`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // Set height manually since an iFrame does not enlarge the modal
  ${({ $hasIframe }) => ($hasIframe ? 'height: 75%' : 'height: auto')}
`
export const StyledFormFooter = styled(FormFooter)`
  padding-left: ${themeSpacing(4)};
  padding-bottom: ${themeSpacing(4)};
  padding-top: unset;
  height: 44px;
`
