// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import {
  Column as AscColumn,
  themeColor,
  themeSpacing,
  SearchBar as AscSearchBar,
} from '@amsterdam/asc-ui'
import { CompactPager } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ButtonComponent from 'components/Button'

export const Column = styled(AscColumn)`
  display: flex;
  flex-direction: column;
  justify-content: unset;
`

export const SearchBar = styled(AscSearchBar)`
  margin-bottom: ${themeSpacing(3)};
`

export const Pagination = styled(CompactPager)`
  background-color: ${themeColor('tint', 'level1')};
  margin-top: 1.5rem;
  max-width: 200px;
`

export const Button = styled(ButtonComponent)`
  width: fit-content;
`

export const Span = styled.span`
  margin-top: ${themeSpacing(5)};
`

export const Text = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: ${themeSpacing(3)};
`

export const P = styled.p`
  margin-top: ${themeSpacing(3)};
`
