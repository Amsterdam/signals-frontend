// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeSpacing, themeColor, breakpoint } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Section = styled.section`
  position: relative;
  padding: ${themeSpacing(6, 0, 0)};
  border-top: 2px solid ${themeColor('tint', 'level3')};

  &:last-of-type {
    border-bottom: 2px solid ${themeColor('tint', 'level3')};
  }
`

export const Header = styled.header`
  display: grid;
  position: relative;
  column-gap: ${themeSpacing(5)};
  grid-template-columns: 12fr;
  margin-bottom: ${themeSpacing(4)};
`

export const LinkContainer = styled.div`
  padding: ${themeSpacing(6)} 0;

  @media screen and ${breakpoint('min-width', 'laptopM')} {
    padding-top: 0;

    a {
      position: absolute;
      top: ${themeSpacing(6)};
      right: 0;
    }
  }
`

export const Dl = styled.dl`
  margin: 0;
  padding: 0;
  line-height: 24px;
  overflow-wrap: anywhere;
  dd:not(:last-of-type) {
    margin-bottom: ${themeSpacing(6)};
  }

  dt {
    font-weight: 700;
    margin-bottom: ${themeSpacing(1)};
  }
`

export const Wrapper = styled.div`
  margin-bottom: ${themeSpacing(8)};
  word-break: normal;
`
