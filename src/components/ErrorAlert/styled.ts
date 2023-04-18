// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledErrorAlert = styled.p.attrs({
  role: 'alert',
})`
  border: ${themeColor('support', 'invalid')} 2px solid;
  color: ${themeColor('support', 'invalid')};
  font-weight: 700;
  line-height: ${themeSpacing(6)};
  margin-bottom: 0;
  margin-top: 0;
  padding: ${themeSpacing(3)};
`
