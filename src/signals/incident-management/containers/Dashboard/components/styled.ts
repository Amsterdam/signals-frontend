// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Wrapper = styled.span`
  position: absolute;
  display: flex;
  flex-direction: column;
  color: ${themeColor('primary')};
  right: 50px;
  bottom: 60px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 700;
  text-align: right;
`

export const Description = styled.span`
  font-size: 7px;
  line-height: 8px;
`
