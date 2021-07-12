// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import styled, { css } from 'styled-components'
import {
  Button,
  Heading,
  Paragraph,
  themeSpacing,
  themeColor,
} from '@amsterdam/asc-ui'
import {
  SITE_HEADER_BOTTOM_GAP_HEIGHT,
  SITE_HEADER_HEIGHT_TALL,
} from 'containers/SiteHeader/constants'
import {
  ONCLOSE_TIMEOUT,
  VARIANT_ERROR,
  VARIANT_SUCCESS,
} from 'containers/Notification/constants'
import { Theme } from 'types/theme'
import { Variant } from 'containers/Notification/types'

export const Wrapper = styled.div<{
  top?: number
  variant?: Variant
  theme: Theme
}>`
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case VARIANT_ERROR:
        return themeColor('support', 'invalid')({ theme })
      case VARIANT_SUCCESS:
        return themeColor('support', 'valid')({ theme })
      default:
        return themeColor('primary')({ theme })
    }
  }};

  align-items: center;
  display: flex;
  margin-left: 50vw;
  max-width: 1400px;
  min-height: ${SITE_HEADER_BOTTOM_GAP_HEIGHT}px;
  position: ${({ top }) =>
    top === SITE_HEADER_HEIGHT_TALL ? 'absolute' : 'fixed'};
  top: ${({ top }) => top}px;
  transform: translateX(-50vw) translateY(0);
  transition-property: transform opacity;
  transition-timing-function: ease-out;
  transition-duration: ${ONCLOSE_TIMEOUT}ms;
  width: 100vw;
  will-change: transform, opacity;
  z-index: 1;
  opacity: 1;

  @media (min-width: 1400px) {
    margin-left: 50%;
    transform: translateX(-50%) translateY(0);
  }

  @media screen and (max-width: 539px) {
    top: 50px;
  }

  &.slideup {
    transform: translateX(-50vw) translateY(-100%);

    @media (min-width: 1400px) {
      transform: translateX(-50%) translateY(-100%);
    }
  }

  &.fadeout {
    opacity: 0;
  }

  @media (min-width: 1400px) {
    width: 100%;
  }

  & > * {
    width: 100%;
  }
`

export const Title = styled(Heading).attrs({
  forwardedAs: 'h6',
})`
  color: white;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  font-weight: normal;
  margin: ${({ hasMargin = false }: { hasMargin?: boolean }) =>
    hasMargin
      ? css`
          ${themeSpacing(2)} 0 0
        `
      : 0};

  & + & {
    margin-top: ${themeSpacing(2)};
  }
`

export const Message = styled(Paragraph)`
  color: white;
  margin: 0 0 ${themeSpacing(2)};
  font-size: 16px;
`

export const CloseButton = styled(Button)<{ alignTop?: boolean }>`
  ${({ alignTop = false }) =>
    alignTop
      ? css`
          margin-top: ${themeSpacing(2)};
        `
      : css`
          align-self: center;
        `}

  margin-left: ${themeSpacing(3)};

  &,
  &:hover {
    background-color: transparent;
  }

  & svg path {
    fill: white !important;
  }
`
