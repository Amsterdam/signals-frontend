// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent, InputHTMLAttributes } from 'react'
import styled from 'styled-components'
import { Radio, themeSpacing } from '@amsterdam/asc-ui'

const Wrapper = styled.span`
  position: relative;
  z-index: 0;

  & > * {
    margin-left: ${themeSpacing(-1)};
  }
`

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  id: string
  value: string
}

const RadioButton: FunctionComponent<RadioButtonProps> = ({
  className,
  ...props
}) => (
  <Wrapper className={className}>
    <Radio {...props} />
  </Wrapper>
)

export default RadioButton
