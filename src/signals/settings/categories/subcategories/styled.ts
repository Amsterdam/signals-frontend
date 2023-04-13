// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { themeSpacing, CompactPager } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import DataView from 'components/DataView'

export const StyledDataView = styled(DataView)`
  th:first-child {
    width: 50%;
  }
`

export const StyledCompactPager = styled(CompactPager)`
  max-width: 200px;
  margin-top: ${themeSpacing(6)};
`

export const FormContainer = styled.div`
  // taking into account the space that the FormFooter component takes up
  padding-bottom: 66px;
`
