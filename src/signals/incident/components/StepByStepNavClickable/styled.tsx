// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2022 Gemeente Amsterdam
import { themeColor } from '@amsterdam/asc-ui'
import {
  ListItem,
  Label,
} from '@amsterdam/asc-ui/lib/components/StepByStepNav/StepByStepNavStyle'
import styled, { css } from 'styled-components'

export const StyledListItem = styled(ListItem)<{
  index: number
  stepsCompletedCount: number
}>`
  ${({ index, stepsCompletedCount }) => css`
    cursor: ${index <= stepsCompletedCount ? 'pointer' : ''};
    ${index <= stepsCompletedCount &&
    css`
      ${StyledLabel}:before {
        background-color: ${themeColor('primary', 'main')};
      }
      ${StyledLabel}: hover {
        text-decoration: underline;
      }
    `}
  `}
`

export const StyledLabel = styled(Label)``
