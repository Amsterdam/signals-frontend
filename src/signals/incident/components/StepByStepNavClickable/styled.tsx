// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
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
      ${Label}:before {
        background-color: ${themeColor('primary', 'main')};
      }
    `}
  `}
`

export const styledLabel = styled(Label)``
