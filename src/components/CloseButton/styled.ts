// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'

export const StyledButton = styled(Button)`
  position: absolute;
  top: 40px;
  z-index: 1;
  right: ${({ theme }) => theme.layouts.small.margin}px;
  margin-right: ${themeSpacing(4)};

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    right: ${({ theme }) => theme.layouts.medium.margin}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.big.max}px) {
    right: ${({ theme }) => theme.layouts.big.margin}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.large.min}px) {
    right: ${({ theme }) => theme.layouts.large.margin}px;
  }

  @media (min-width: ${({ theme }) => theme.layouts.xLarge.min}px) {
    right: ${({ theme }) => theme.layouts.xLarge.margin}px;
  }
`
