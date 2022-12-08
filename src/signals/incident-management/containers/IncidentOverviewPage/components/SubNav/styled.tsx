// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { themeSpacing, themeColor, Heading } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const MapHeading = styled(Heading).attrs({
  forwardedAs: 'h2',
})`
  margin: 0;
  font-size: inherit;
`

export const TabContainer = styled.div`
  border-bottom: 2px solid ${themeColor('tint', 'level3')};
  display: flex;
  padding-bottom: ${themeSpacing(1)};

  a {
    text-decoration: none;
  }
`

export const Tab = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0);
  padding: 0 10px 6px;
  color: ${themeColor('tint', 'level6')};

  &.active {
    pointer-events: none;
    box-shadow: 0 6px 0 0 ${themeColor('secondary')};
    color: ${themeColor('secondary')};
  }

  &:not(.active):hover {
    box-shadow: 0 6px 0 0 rgba(0, 0, 0, 1);
    color: ${themeColor('tint', 'level6')};
  }

  & + & {
    margin-left: ${themeSpacing(7)};
  }
`
