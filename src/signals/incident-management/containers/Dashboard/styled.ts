// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledRow = styled.div`
  width: 100%;
  height: ${themeSpacing(14)};
  background-color: ${themeColor('tint', 'level2')};
  margin: 0;
`

export const Title = styled.h6`
  font-size: 18px;
  line-height: 32px;
  color: ${themeColor('tint', 'level7')};
  margin-bottom: 0;
`

export const Subtitle = styled.p`
  color: ${themeColor('tint', 'level5')};
  line-height: 24px;
  margin-top: 0;
  margin-bottom: 0;
`
export const Amount = styled.span`
  color: ${themeColor('primary')};
`
