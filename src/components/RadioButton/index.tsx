// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FunctionComponent, InputHTMLAttributes } from 'react'

import { Radio, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const Wrapper = styled.span`
  position: relative;
  z-index: 0;

  // Safari does not pick up the focus ring implemented in amsterdam-styled-components
  // Add radio button focus color with contrast of 4.11 (requirement is 3+)
  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      input:focus + * {
        box-shadow: 0 0 0 3px #3477f6;
      }
    }
  }

  & > * {
    margin-left: ${themeSpacing(-1)};
  }
`

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  id: string
  value?: string
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
