import { Close } from '@amsterdam/asc-assets'
import { breakpoint, Button, themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import type { LegendPanelProps } from './LegendPanel'
import { DETAIL_PANEL_WIDTH } from '../../../constants'
import { ScrollWrapper } from '../styled'

/**
 * Panel is positioned off-screen by 200% of its own width (or height, depending on the orientation).
 * If it's positioned by 100% of its width, the panel will be visible on mobile devices when the
 * screen is pulled in the direction of where the panel is hidden.
 * As a result, the sliding animation has to be a two-step animation where the first step is skipped when
 * the panel is sliding in.
 */
export const Panel = styled.div<{ slide: LegendPanelProps['slide'] }>`
  background-color: white;
  box-shadow: 2px 0 2px rgba(0, 0, 0, 0.1);
  left: 0;
  padding: ${themeSpacing(4)};
  position: absolute;
  top: 0;
  width: ${DETAIL_PANEL_WIDTH - 20}px;

  ${({ slide }) =>
    slide === 'in'
      ? css`
          transition: transform 0.25s -0.25s, transform 0.25s 0s;
          transition-timing-function: ease-out;
        `
      : css`
          transition: transform 0.25s 0s;
          transition-timing-function: ease-in;
        `}

  @media only screen and ${breakpoint('min-width', 'tabletM')} {
    height: 100vh;
    flex: 0 0 ${DETAIL_PANEL_WIDTH}px;
    transform: translate3d(
      ${({ slide }) => (slide === 'out' ? '-200%' : 0)},
      0,
      0
    );
  }

  @media only screen and ${breakpoint('max-width', 'tabletM')} {
    bottom: 0;
    flex: 0 0 50vh;
    order: 1;
    position: fixed;
    transform: translate3d(
      0,
      ${({ slide }) => (slide === 'out' ? '200%' : '0')},
      0
    );
    width: 100vw;
    max-height: 50vh;
  }

  ${ScrollWrapper} {
    padding: 0;
    height: calc(100% - 22px);
  }
`

export const CloseBtn = styled(Button).attrs({
  icon: <Close />,
  iconSize: 20,
  size: 28,
  variant: 'blank',
})`
  cursor: pointer;
  position: absolute;
  top: ${themeSpacing(4)};
  right: ${themeSpacing(4)};
`
