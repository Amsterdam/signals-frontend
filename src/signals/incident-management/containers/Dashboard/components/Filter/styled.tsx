// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { RefObject } from 'react'

import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import Refresh from '../../../../../../images/icon-refresh.svg'

export const FilterContainer = styled.div<{
  ref: RefObject<HTMLDivElement>
}>`
  width: 100%;
  position: relative;
`

export const SelectUl = styled.ul`
  display: flex;
  font-size: 1rem;
  height: ${themeSpacing(14)};
  margin: 0;
`

// with callback show selected value with underline
export const SelectLi = styled.li<{
  selected?: boolean
}>`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: ${themeSpacing(9)};

  ${({ selected }) =>
    selected &&
    css`
      text-decoration: underline;
    `}
`

export const InvisibleButton = styled.button<{ selected: boolean }>`
  text-decoration: none;
  background-color: unset;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-left: ${themeSpacing(3)};

  > * {
    transition: transform 0.25s;

    ${({ selected }) =>
      selected &&
      css`
        transform: rotate(180deg);
      `}
  }
`
export const RefreshIcon = styled(Refresh)`
  margin-right: ${themeSpacing(2)};
`

export const OptionOverlay = styled.div`
  position: fixed;
  height: calc(100% - 106px);
  top: 106px;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: ${themeColor('tint', 'level3')};
`

export const OptionUl = styled.ul`
  display: grid;
  position: absolute;
  width: 700px;
  top: ${themeSpacing(14)};
  grid-template-columns: repeat(2, 1fr);
  line-height: 2;
  padding: 0;
  max-height: calc(100vh - ${themeSpacing(26.5)});
  margin: 0;
  overflow-y: auto;
  z-index: 1;
`

// with callback show selected value with underline
export const OptionLi = styled.li<{ selected: boolean }>`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`
