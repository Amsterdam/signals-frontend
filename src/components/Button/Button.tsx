// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled, { css } from 'styled-components'
import type { ButtonProps } from '@amsterdam/asc-ui'
import {
  Button as AscButton,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'

const MIN_BUTTON_WIDTH = 90

const Button = styled(AscButton)`
  min-width: ${MIN_BUTTON_WIDTH}px;
  justify-content: center;
  font-family: Avenir Next;

  svg path {
    fill: inherit;
  }

  ${({ variant, type }: ButtonProps) =>
    variant === 'application' &&
    type === 'button' &&
    css`
      padding: ${themeSpacing(1, 4)};

      // Required for buttons that are rendered as 'Link'
      color: ${themeColor('tint', 'level7')};
    `}
`

export default Button
