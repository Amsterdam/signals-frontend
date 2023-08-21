// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeColor, Icon, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const ColumnDescription = styled.div`
  margin-left: 26px;
`

export const ColumnStatus = styled.div`
  margin-bottom: 4px;
`

export const Status = styled.span`
  color: ${themeColor('tint', 'level5')};
  font-weight: 700;
  line-height: 16px;
`

export const StyledIcon = styled(Icon)`
  margin: 0 14px 0 0;
  display: inline-block;
`

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 8px;

  em {
    background-color: ${themeColor('tint', 'level3')};
    font-style: normal;
    padding: ${themeSpacing(0, 1)};
  }
`

export const Text = styled.div<{ $isHighlighted: boolean }>`
  font-weight: 400;
  line-height: 16px;
  line-height: 24px;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $isHighlighted }) =>
    $isHighlighted &&
    css`
      white-space: wrap;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      em {
        background-color: ${themeColor('tint', 'level3')};
        font-style: normal;
        font-weight: 700;
        padding: ${themeSpacing(0, 1)};
      }
    `}
`

export const Wrapper = styled.div`
  margin-bottom: 24px;
  cursor: pointer;
`
