// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import {
  themeColor,
  themeSpacing,
  SearchBar as AscSearchBar,
  Label as AscLabel,
} from '@amsterdam/asc-ui'
import { breakpoint, CompactPager } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ButtonComponent from 'components/Button'

export const Button = styled(ButtonComponent)`
  width: fit-content;
`

export const Label = styled(AscLabel)`
  display: flex;
  flex-direction: column-reverse;
  align-items: baseline;
  font-weight: 700;
`

export const P = styled.p`
  margin-top: ${themeSpacing(3)};
`

export const Pagination = styled(CompactPager)`
  background-color: ${themeColor('tint', 'level1')};
  margin-top: 1.5rem;
  max-width: 200px;
`

export const Span = styled.span`
  margin-top: ${themeSpacing(5)};
`

export const Text = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: ${themeSpacing(3)};
`

export const SearchBar = styled(AscSearchBar)`
  margin-bottom: ${themeSpacing(8)};
  width: 100%;
`

export const Grid = styled.div`
  display: grid;
  grid-column-gap: ${themeSpacing(6)};
  grid-template-columns: 2fr 3fr 1fr;
  justify-content: space-between;
  width: 100%;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    grid-template-columns: 1fr;
    grid-row-gap: ${themeSpacing(6)};
  }
`
