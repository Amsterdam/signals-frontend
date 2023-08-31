// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const Label = styled.div`
  font-weight: 700;
  margin: 0;
`

const getStyle = (type?: string) => {
  switch (type) {
    case 'alert':
      return css`
        color: ${themeColor('secondary')};
        border: 2px solid ${themeColor('secondary')};
        padding: ${themeSpacing(2, 5)};
        font-weight: 700;
        p {
          color: inherit;
        }
      `
    case 'info':
      return css`
        background-color: ${themeColor('primary')};
        padding: ${themeSpacing(5)};
        a:hover {
          color: ${themeColor('tint', 'level1')};
        }

        * {
          // Make sure links contrast with blue background
          color: ${themeColor('tint', 'level1')};
        }
      `
    case 'citation':
    case 'disclaimer':
      return css`
        background-color: ${themeColor('tint', 'level3')};
        padding: ${themeSpacing(5)};
      `
    case 'caution':
      return css`
        border-left: 3px solid ${themeColor('secondary')};
        padding-left: ${themeSpacing(3)};
      `
    case 'alert-inverted':
      return css`
        background-color: ${themeColor('secondary')};
        color: ${themeColor('tint', 'level1')};
        padding: ${themeSpacing(4)};
        p {
          color: inherit;
        }
      `
    case 'message':
      return css`
        color: ${themeColor('tint', 'level7')};
      `
    default:
      return css`
        color: ${themeColor('tint', 'level5')};
        a,
        p {
          color: inherit;
        }
      `
  }
}

export const Wrapper = styled.div<{ type?: string }>`
  ul {
    padding: ${themeSpacing(0, 0, 0, 6)};
    margin: 0;

    li {
      list-style-type: square;
    }
  }

  > :first-child {
    margin-top: 0;
  }

  > :last-child {
    margin-bottom: 0;
  }

  ${({ type }) => getStyle(type)}
`
