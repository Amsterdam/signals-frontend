// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledRow = styled.div`
  width: 100%;
  height: ${themeSpacing(14)};
  background-color: ${themeColor('tint', 'level2')};
  margin: 0;
`

export const Wrapper = styled.div`
  margin: ${themeSpacing(0, 15)};
  display: grid;
  box-sizing: content-box;
  grid-column-gap: 40px;
  grid-template-columns: 2fr 1fr;

  @media screen and ${breakpoint('max-width', 'laptopM')} {
    display: flex;
    flex-direction: column;
  }
`
