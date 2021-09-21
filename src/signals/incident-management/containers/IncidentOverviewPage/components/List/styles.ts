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

export const ThStadsdeel = styled(Th)`
  // Keep Amsterdam's 'Stadsdeel' column at a min-width of 120px to make sure that 'Nieuw-West'
  // doesn't wrap (but 'Het Amsterdamse Bos' is allowed to wrap)
  min-width: 120px;
`

export const TdStyle = styled.td<{ noWrap?: boolean }>`
  ${({ noWrap }) => noWrap && 'white-space: nowrap;'}
  padding: 0;

  span {
    display: flex;
    box-sizing: content-box;

    a {
      text-decoration: none;
      color: black;
      display: flex;
      padding: ${themeSpacing(2)};
    }
  }
`

export const StyledIcon = styled(Icon)`
  & svg {
    fill: ${themeColor('tint', 'level4')};
  }
`
