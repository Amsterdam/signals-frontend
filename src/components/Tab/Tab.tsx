import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Tab = styled.span.attrs(() => ({
  role: 'tab',
}))`
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
