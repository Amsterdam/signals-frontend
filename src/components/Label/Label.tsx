// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

interface LabelProps {
  /** When true, will render the label with a plain font instead of a bold font */
  inline?: boolean
  /** When false, the Label component will render as an inline-block element without the red header colour */
  isGroupHeader?: boolean
  /** when true, a label is also black when rendered as group header. Reference: https://www.amsterdam.nl/digitalservices/design-system/?vkurl=designsystem */
  isNewDesignSystem?: boolean
}

const Label = styled.label<LabelProps>`
  font-weight: ${({ inline = false }) => (inline ? 400 : 700)};
  margin-bottom: ${themeSpacing(1)};
  padding: 0;
  display: inline-block;
  vertical-align: text-top;
  color: inherit;
  font-size: ${({ isGroupHeader }) => (isGroupHeader ? '1.125rem' : '1rem')};
  color: ${({ isGroupHeader, isNewDesignSystem }) =>
    isGroupHeader && !isNewDesignSystem ? themeColor('secondary') : 'inherit'};
`

export default Label
