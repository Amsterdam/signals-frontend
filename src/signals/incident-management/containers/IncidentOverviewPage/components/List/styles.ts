// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { themeSpacing, Icon, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledList = styled.div<{ isLoading: boolean }>`
  width: 100%;
  overflow: auto;

  ${({ isLoading }) => isLoading && 'opacity: 0.3;'}
`

export const Table = styled.table`
  border-collapse: separate;
  width: 100%;
  height: 100%;

  tr:hover td,
  td {
    box-shadow: unset;
  }
`

export const Th = styled.th`
  cursor: pointer;
  font-weight: normal;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`

export const ThParent = styled(Th)`
  width: 40px;
`

export const ThPriority = styled(Th)`
  width: 32px;
`

export const ThDate = styled(Th)`
  width: 150px;
`

export const ThArea = styled(Th)`
  width: 120px;
`

export const ThSubcategory = styled(Th)`
  width: 220px;
`

export const ThStatus = styled(Th)`
  width: 160px;
`

export const TdStyle = styled.td`
  padding: 0 ${themeSpacing(2)};
  height: 60px;

  a {
    text-decoration: none;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;

    // Show ellipsis on second line
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
`

export const StyledIcon = styled(Icon)`
  & svg {
    fill: ${themeColor('tint', 'level4')};
  }
`
