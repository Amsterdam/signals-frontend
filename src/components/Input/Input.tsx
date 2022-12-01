// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import {
  Input as AscInput,
  Label,
  themeColor,
  Typography,
  themeSpacing,
} from '@amsterdam/asc-ui'
import type { InputProps as AscInputProps } from '@amsterdam/asc-ui/es/components/Input/Input'
import styled, { css } from 'styled-components'

const Hint = styled.span`
  color: ${themeColor('tint', 'level5')};
  display: block;
  margin-bottom: ${themeSpacing(2)};
`

const StyledInput = styled(AscInput)<{ showError: boolean }>`
  padding: 10px; /* needed to style the textboxes as according to the design system */
  box-shadow: initial;
  font-family: 'Amsterdam Sans', sans-serif;

  &[disabled] {
    border: 1px solid ${themeColor('tint', 'level4')};
    color: ${themeColor('tint', 'level4')};
  }

  ${({ showError }) =>
    showError &&
    css`
      & {
        border: 2px solid ${themeColor('secondary')};
      }
    `}
`

const Error = styled(Typography).attrs({
  forwardedAs: 'h6',
})`
  color: ${themeColor('secondary')};
  font-weight: 700;
  margin: ${themeSpacing(2)} 0;
`

export const StyledLabel = styled(Label)<{ hasHint: boolean }>`
  display: block;
  font-weight: 700;
  ${({ hasHint }) =>
    !hasHint &&
    css`
      margin-bottom: ${themeSpacing(2)};
    `}
`

const Wrapper = styled.div<{ showError: boolean }>`
  ${({ showError }) =>
    showError &&
    css`
      border-left: 2px solid ${themeColor('secondary')};
      padding-left: ${themeSpacing(4)};
    `}
`

interface InputProps extends Omit<AscInputProps, 'error'> {
  id?: string
  label?: ReactNode
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hint, label, id, error, ...rest }, ref) => (
    <Wrapper className={className} showError={Boolean(error)}>
      {label && (
        <StyledLabel hasHint={Boolean(hint)} htmlFor={id} label={label} />
      )}
      {hint && <Hint>{hint}</Hint>}
      {error && <Error>{error}</Error>}
      <StyledInput id={id} showError={Boolean(error)} ref={ref} {...rest} />
    </Wrapper>
  )
)

export default Input
