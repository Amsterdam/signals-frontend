// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;

  @media screen and ${breakpoint('min-width', 'laptop')} {
    margin-right: 60px;
  }
`
