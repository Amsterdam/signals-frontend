// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import {
  Column,
  themeSpacing,
  Paragraph as AscParagraph,
  themeColor,
  Link,
  CompactPager,
} from '@amsterdam/asc-ui'
import Button from 'components/Button'
import Paragraph from 'components/Paragraph'

export const StyledButton = styled(Button)`
  margin-left: 10px;
  margin-bottom: ${themeSpacing(2)};
`

export const StyledPagination = styled(CompactPager)`
  background-color: ${themeColor('tint', 'level1')};
`

export const PaginationWrapper = styled.div`
  margin-top: ${themeSpacing(5)};
`

export const StyledParagraph = styled(Paragraph)`
  margin-right: ${themeSpacing(3)};
`

export const StyledLink = styled(Link)`
  display: block;
  margin-right: ${themeSpacing(3)};

  text-decoration: underline;
  font-size: 16px;

  :hover {
    cursor: pointer;

    & > * {
      color: ${themeColor('secondary')};
    }
  }
`
export const NoResults = styled(AscParagraph)`
  width: 100%;
  text-align: center;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  color: ${themeColor('tint', 'level4')};
`

export const MapWrapper = styled(Column).attrs({
  span: 12,
})`
  flex-direction: column;
`

export const PageHeaderItem = styled.div`
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
`

export const StyledPageHeaderItem = styled(PageHeaderItem)`
  margin-bottom: ${themeSpacing(4)};
`
