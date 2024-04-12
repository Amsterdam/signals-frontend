// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import { themeSpacing, Icon, themeColor } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const StyledList = styled.div<{ isLoading?: boolean }>`
  width: 100%;
  overflow: auto;

  ${({ isLoading }) => isLoading && 'opacity: 0.3;'}
`

export const Table = styled.table`
  border-collapse: separate;
  width: 100%;
  height: 100%;

  tr > th > svg {
    height: ${themeSpacing(4)};
    margin-left: ${themeSpacing(2.5)};
    margin-bottom: -${themeSpacing(0.5)};
    fill: ${themeColor('primary')};
  }
`

const Th = styled.th`
  white-space: nowrap;
`

export const Tr = styled.tr<{ $lastIncident?: boolean }>`
  :focus {
    outline: auto;
  }

  &:hover td,
  td {
    box-shadow: unset;
  }

  /* Because of a quirk in Safari, the box shadow needs to be set on the cell instead of the row */
  ${({ $lastIncident }) =>
    $lastIncident &&
    css`
      & td,
      &:hover td {
        border-bottom: none;
        box-shadow: black 0px 2px 0px 0px inset, black 0px -2px 0px 0px inset;
      }

      & td:first-child,
      &:hover td:first-child {
        box-shadow: black 0px 2px 0px 0px inset, black 0px -2px 0px 0px inset,
          black 2px 0px 0px 0px inset;
      }

      & td:last-child,
      &:hover td:last-child {
        box-shadow: black 0px 2px 0px 0px inset, black 0px -2px 0px 0px inset,
          black -2px 0px 0px 0px inset;
      }
    `}
`

export const BaseTh = styled(Th)<{ $isDisabled?: boolean }>`
  cursor: pointer;
  color: ${themeColor('primary')};

  &:hover {
    text-decoration: underline;
    color: ${themeColor('primary', 'dark')};
  }

  ${({ $isDisabled }) =>
    $isDisabled &&
    css`
      &,
      &:hover {
        cursor: auto;
        text-decoration: none;
        color: ${themeColor('tint', 'level7')};
      }
    `}
`

export const ThParent = styled(Th)`
  width: 45px;
  min-height: 1px;
`

export const ThPriority = styled(BaseTh)`
  width: 32px;
`

export const ThDate = styled(BaseTh)`
  width: 150px;
`

export const ThArea = styled(BaseTh)`
  width: 120px;
`

export const ThSubcategory = styled(BaseTh)`
  width: 220px;
`

export const ThStatus = styled(BaseTh)`
  width: 160px;
`

export const ThId = styled(BaseTh)`
  width: 95px;
`

export const ThDay = styled(BaseTh)`
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
  size: 16,
  role: 'img',
})`
  & svg {
    fill: ${themeColor('tint', 'level4')};
  }
`
