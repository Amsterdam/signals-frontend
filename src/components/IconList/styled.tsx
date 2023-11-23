// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeSpacing, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Checkbox from '../Checkbox'

export const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  min-height: ${themeSpacing(13)};
  flex: 1;
  margin: 0;
  padding: 0;

  ${Checkbox} {
    cursor: pointer;
  }
`

export const StyledImg = styled.img`
  margin-right: ${themeSpacing(2)};
  flex-shrink: 0;
`

export const StatusIcon = styled.img`
  margin-left: -20px;
  margin-top: -30px;
`
