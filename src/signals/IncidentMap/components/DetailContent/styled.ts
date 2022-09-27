// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const StyledList = styled.dl`
  margin: 0;

  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: ${themeSpacing(1)};
    margin-top: ${themeSpacing(5)};

    position: relative;
    font-weight: 400;
  }

  dd {
    &:not(:last-child) {
      margin-bottom: ${themeSpacing(2)};
    }

    &.alert {
      color: ${themeColor('secondary')};
    }
  }
`
