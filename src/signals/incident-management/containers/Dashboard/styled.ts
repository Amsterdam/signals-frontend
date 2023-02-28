// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { breakpoint, themeColor } from '@amsterdam/asc-ui'
import { Row } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { TabContainer } from '../../../../components/Tab'

import { TabContainer } from '../../../../components/Tab'

export const FilterWrapper = styled.div`
  width: 100%;
  background-color: ${themeColor('tint', 'level2')};
  margin: 0;
`

export const StyledRow = styled(Row)`
  @media only screen and ${breakpoint('min-width', 'laptopM')} {
    padding: 0 60px;
  }
`

export const StyledTabContainer = styled(TabContainer)`
  margin-top: 1.5rem;
  margin-left: auto;
`
