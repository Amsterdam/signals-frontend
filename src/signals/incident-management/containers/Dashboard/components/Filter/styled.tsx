// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { RefObject } from 'react'

import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import Refresh from '../../../../../../images/icon-refresh.svg'

export const FilterBar = styled.div<{
  ref: RefObject<HTMLDivElement>
}>`
  width: 100%;
  position: relative;
`

export const SelectContainer = styled.div`
  display: flex;
  font-size: 1rem;
  margin: 0;
  flex-direction: column;

  @media ${breakpoint('min-width', 'tabletM')} {
    flex-direction: row;
  }
`

export const Select = styled.div<{
  selected?: boolean
}>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 2.9rem;
  margin: 0.3rem 2.25rem 0.3rem 3rem;

  @media ${breakpoint('min-width', 'tabletM')} {
    margin-left: unset;
    &:first-of-type {
      margin-left: 3rem;
    }
  }

  ${({ selected }) =>
    selected &&
    css`
      text-decoration: underline;
    `}
`

export const InvisibleButton = styled.button<{ selected: boolean }>`
  background-color: unset;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-left: ${themeSpacing(3)};

  > * {
    transition: transform 0.1s;

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

export const OptionListDropdown = styled.div<{
  active: boolean
  optionOffsetTop?: number
}>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${themeSpacing(14)};
  height: 0;
  overflow-y: auto;
  opacity: 0;
  background-color: ${themeColor('tint', 'level2')};
  transition: opacity 0.1s ease-out;
  z-index: 1;

  ${({ active, optionOffsetTop }) =>
    active &&
    optionOffsetTop &&
    css`
      height: calc(100vh - ${themeSpacing(26.5)});
      top: ${optionOffsetTop}px;
      opacity: 100;
    `}
`

export const OptionUl = styled.ul<{
  optionsOffsetLeft?: number
  optionsTotal: number
}>`
  display: grid;
  position: absolute;
  line-height: 1.4rem;
  padding: 0;
  margin: 0;
  width: 100%;

  ${({ optionsOffsetLeft, optionsTotal }) =>
    css`
      left: ${optionsOffsetLeft}px;
      grid-template-columns: repeat(${optionsTotal < 13 ? 1 : 2}, 1fr);
      grid-gap: 0 8px;
    `}

  @media ${breakpoint('min-width', 'tabletM')} {
    width: ${themeSpacing(175)};
  }
`

export const OptionLi = styled.li<{ selected: boolean }>`
  cursor: pointer;
  margin: 0.3rem 0; // Add margin to stop the focus from overlapping

  &:hover {
    text-decoration: underline;
  }
`
