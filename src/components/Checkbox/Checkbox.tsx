// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Checkbox } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const StyledCheckbox = styled(Checkbox)<{
  name?: string
  type?: string
  value?: string
}>`
  z-index: 0;
  & > * {
    margin-left: -4px;
  }
`

export default StyledCheckbox
