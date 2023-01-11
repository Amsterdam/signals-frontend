// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Row, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledRow = styled(Row)`
  width: 100%;
  height: ${themeSpacing(14)};
  background-color: ${themeColor('tint', 'level3')};
  margin: 0;
`
