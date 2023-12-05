// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import {
  Column,
  themeSpacing,
  Paragraph as AscParagraph,
  themeColor,
  Link,
  CompactPager,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'
import Paragraph from 'components/Paragraph'

export const TitleRow = styled.div`
  display: flex;
  width: 100%;
  margin-top: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(3)};
  & > section {
    width: 100%;
    margin-bottom: 0;
    padding: 0;
  }
`

export const StyledButton = styled(Button)<{ $disabled?: boolean }>`
  ${({ $disabled }) =>
    $disabled &&
    `
    &, &:hover{
      cursor: default;
      outline: none;
      border: none;
      color: rgb(180, 180, 180);
      background-color: rgb(230, 230, 230);
      text-decoration: none;
    }
    
  `}
  margin-left: 10px;
`

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const StyledPagination = styled(CompactPager)`
  background-color: ${themeColor('tint', 'level1')};
  min-width: 200px;
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
  font-size: 1rem;

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
  font-weight: 700;
  color: ${themeColor('tint', 'level4')};
`

export const MapWrapper = styled(Column).attrs({
  span: 12,
})`
  flex-direction: column;
`

export const NavWrapper = styled(Column).attrs({
  span: 12,
})`
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  min-height: 46px;
  margin-bottom: ${themeSpacing(5)};
`

export const PageTitle = styled.div`
  display: flex;
`

export const PageHeaderItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${themeSpacing(1)};
`

export const StyledPageHeaderItem = styled(PageHeaderItem)`
  margin-bottom: ${themeSpacing(4)};
`
