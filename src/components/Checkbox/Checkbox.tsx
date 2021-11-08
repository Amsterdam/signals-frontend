// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { Checkbox } from '@amsterdam/asc-ui'

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
