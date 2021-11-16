// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { themeSpacing, Icon, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledList = styled.div<{ isLoading?: boolean }>`
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
  font-weight: normal;
  white-space: nowrap;
`

export const Tr = styled.tr`
  :focus {
    outline: auto;
  }
`

export const ThParent = styled(Th)`
  width: 45px;
  min-height: 1px;
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

export const ThId = styled(Th)`
  width: 95px;
`

export const ThDay = styled(Th)`
  width: 55px;
`

export const ContentSpan = styled.span``

export const TdStyle = styled.td`
  padding: 0;
  height: 60px;

  a {
    display: flex;
    align-items: center;
    padding: 0 ${themeSpacing(2)};
    height: 100%;

    text-decoration: none;
    color: black;

    ${ContentSpan} {
      // Show ellipsis on second line
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      height: auto;
    }
  }
`

export const StyledIcon = styled(Icon).attrs({
  size: 14,
  role: 'img',
})`
  & svg {
    fill: ${themeColor('tint', 'level4')};
  }
`
