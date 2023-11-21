import { breakpoint, Button, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const HANDLE_SIZE_MOBILE = 40
export const MENU_WIDTH = 420

export const CloseButton = styled(Button)`
  position: absolute;
  top: 14px;
  right: 20px;
  min-width: inherit;
  // Needs z-index else content blocks the onClick
  z-index: 1;
  background-color: transparent;

  > span {
    margin-right: 0;
  }
`

export const DetailsWrapper = styled.section`
  position: absolute;
  background-color: ${themeColor('tint', 'level1')};
  bottom: 0;
  left: 0;
  max-width: 100%;
  padding: 20px;
  right: 0;
  top: 0;
  width: calc(${MENU_WIDTH}px - 16px);
  z-index: 2;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    width: 100vh;
    overflow-y: scroll;
    top: unset;
    height: calc(100% - ${HANDLE_SIZE_MOBILE}px);
  }
`

export const StyledList = styled.dl`
  margin: 0;

  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: ${themeSpacing(1)};
    margin-top: ${themeSpacing(5)};
    position: relative;
    font-weight: 400;

    &:first-child {
      margin-top: 0;
    }
  }

  dd {
    font-weight: 500;
    &:not(:last-child) {
      margin-bottom: ${themeSpacing(2)};
    }

    &.alert {
      color: ${themeColor('secondary')};
    }
  }
`
