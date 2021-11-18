import styled from 'styled-components'
import { themeSpacing, themeColor, Heading } from '@amsterdam/asc-ui'

export const MapHeading = styled(Heading).attrs({
  forwardedAs: 'h2',
})`
  margin: 0;
  font-size: 16px;
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
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0px 6px 0px 0px rgba(0, 0, 0, 0);
  padding: 0 10px 6px;
  color: ${themeColor('tint', 'level6')};

  &.active {
    pointer-events: none;
    box-shadow: 0px 6px 0px 0px ${themeColor('secondary')};
    color: ${themeColor('secondary')};
  }

  &:not(.active):hover {
    box-shadow: 0px 6px 0px 0px rgba(0, 0, 0, 1);
    color: ${themeColor('tint', 'level6')};
  }

  & + & {
    margin-left: ${themeSpacing(7)};
  }
`
