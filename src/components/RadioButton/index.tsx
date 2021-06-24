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

const StyledRadio = styled(Radio)`
  & > input:focus {
    outline: none;
  }

  & > input:focus-visible + * {
    box-shadow: 0 0 0 1pt Highlight;
    box-shadow: 0 0 0 1pt -webkit-focus-ring-color;
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
    <StyledRadio {...props} />
  </Wrapper>
)

export default RadioButton
