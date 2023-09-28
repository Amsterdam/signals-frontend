// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ChevronDown } from '@amsterdam/asc-assets'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const Container = styled.div`
  margin: ${themeSpacing(2, 0)};
`

export const Wrapper = styled.div`
  display: flex;
  color: ${themeColor('primary')};
  line-height: 1.5rem;
  cursor: pointer;
`

export const Header = styled.header`
  font-size: 1rem;
  padding: ${themeSpacing(2, 2, 2, 0)};
`

export const Paragraph = styled.p`
  margin: unset;
`

export const InvisibleButton = styled.button<{ toggle: boolean }>`
  text-decoration: none;
  background-color: unset;
  color: inherit;
  border: none;

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
  fill: ${themeColor('primary')};
`

export const Content = styled.div<{ visible: boolean }>`
  display: none;

  ${({ visible }) =>
    visible &&
    css`
      display: block;
    `}
`
