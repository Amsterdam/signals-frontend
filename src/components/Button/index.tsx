// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled, { css } from 'styled-components'
import {
  Button as AscButton,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'

const Button = styled(AscButton)`
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal !important;

  svg path {
    fill: inherit;
  }

  ${({ variant, type }) =>
    variant === 'application' &&
    type === 'button' &&
    css`
      padding: ${themeSpacing(1, 4)};

      // Required for buttons that are rendered as 'Link'
      color: ${themeColor('tint', 'level7')};
    `}
`

export default Button
