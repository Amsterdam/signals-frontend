// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledTable = styled.table`
  contain: strict;
  width: 100%;
`

export const StyledTHead = styled.thead`
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`

export const StyledTR = styled.tr`
  &:nth-of-type(2) {
    th {
      padding-top: 0;
      padding-bottom: ${themeSpacing(4)};
    }
  }
`

export const StyledTH = styled.th`
  border-top: none;
  border-bottom: none;
  padding: ${themeSpacing(3)} ${themeSpacing(2)};
  vertical-align: top;
`

export const StyledTD = styled.td`
  padding: ${themeSpacing(2)};
  cursor: pointer;
`

export const StyledImageTD = styled.td`
  cursor: pointer;
  padding: 0;
`

export const StyledImg = styled.img`
  display: flex;
  margin-left: 8px;
`
