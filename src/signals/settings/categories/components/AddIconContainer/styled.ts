// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { ChevronDown } from '@amsterdam/asc-assets'
import { Button, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const WrapperInfo = styled.div`
  display: flex;
  font-weight: 400;
`

export const StyledInfo = styled.p`
  color: ${themeColor('primary')};
  margin: ${themeSpacing(0, 1.25, 1.75, 0)};
`
export const InvisibleButton = styled.button<{ toggle: boolean }>`
  text-decoration: none;
  background-color: unset;
  color: inherit;
  border: none;
  padding: 0;

  > * {
    transition: transform 0.25s;

    ${({ toggle }) =>
      toggle &&
      css`
        transform: rotate(180deg);
      `}
  }
`

export const StyledChevronDown = styled(ChevronDown)`
  width: ${themeSpacing(3.5)};
  color: ${themeColor('primary')};
`

export const StyledImg = styled.img`
  max-height: ${themeSpacing(8)};
  margin-right: ${themeSpacing(1)};
`

export const StyledInstructions = styled.p`
  color: ${themeColor('tint', 'level6')};
  margin: ${themeSpacing(0, 0, 2.5)};
`

export const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const WrapperIconAdd = styled.div`
  display: flex;
  flex-direction: row;
`

export const StyledButton = styled(Button)`
  background-color: ${themeColor('tint', 'level1')};
  height: ${themeSpacing(8)};
  color: ${themeColor('tint', 'level7')};
  margin-right: ${themeSpacing(3.25)};
  font-weight: 700;
  border-color: ${themeColor('tint', 'level6')};
`
export const DeleteButton = styled(Button).attrs(() => ({
  size: 13,
  iconSize: 13,
}))`
  width: ${themeSpacing(8)};
  height: ${themeSpacing(8)};
  background-color: rgba(0, 0, 0, 0.5);

  svg > path {
    fill: ${themeColor('tint', 'level1')};
  }

  &:hover {
    background-color: black;
  }
`
