// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { ChevronRight } from '@amsterdam/asc-assets'
import {
  breakpoint,
  Button,
  styles,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import type { DeviceMode } from 'types/device'

import type { Address } from '../../types/address'

export const HANDLE_SIZE_MOBILE = 40
export const MENU_WIDTH = 400

export const MapOverlay = styled('div')<{
  $mode: DeviceMode
  $isDesktop: (mode: DeviceMode) => boolean
  $topMobile?: number
  $address?: Address
}>`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: ${({ $mode, $isDesktop, $topMobile, $address }) =>
    $isDesktop($mode)
      ? 0
      : $topMobile
      ? $topMobile === 100
        ? $address
          ? css`calc(100% - 84px)`
          : `100%`
        : css`calc(${Number($topMobile)}%)`
      : '50%'};
  pointer-events: none;
  @media print {
    position: relative;
  }
`

export const DrawerMapOverlay = styled(MapOverlay)`
  flex-direction: column;
  z-index: 1;
`

export const DrawerHandleMobile = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: ${HANDLE_SIZE_MOBILE}px;
  box-shadow: 0px -4px 4px 0 rgb(0 0 0 / 10%);

  &::before {
    content: '';
    display: block;
    width: 68px;
    height: 4px;
    border-radius: 3px;
    background-color: ${themeColor('tint', 'level4')};
  }
`

export const DrawerHandleMiniDesktop = styled.div`
  width: 20px;
  height: 44px;
  background-color: ${themeColor('tint', 'level1')};
  top: 16px;
  position: absolute;
  right: -20px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: content-box;
  border-left: none;
  transition: background-color 0.1s ease-in-out;

  &:before {
    content: '';
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
  }
`

export const DrawerHandleDesktop = styled(Button)`
  flex-shrink: 0;
  width: 0;
  height: 100%;
  position: relative;
  margin-right: ${themeSpacing(5)};

  & > ${styles.IconStyle} {
    opacity: 0;
  }
  &:hover {
    & > ${styles.IconStyle} {
      opacity: 1;
    }
    ${DrawerHandleMiniDesktop} {
      background-color: ${themeColor('tint', 'level3')};
    }
  }
`

export const HandleIcon = styled(ChevronRight)<{ $isOpen: boolean }>`
  transition: transform 0.25s ease-in-out;
  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: rotate(180deg);
    `}
`

export const DrawerContentWrapper = styled('div')`
  width: 100%;
  height: 100%;
  padding: ${themeSpacing(5)};
  overflow-y: auto;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    padding-top: 0;
  }
`

export const DrawerContainer = styled.div<{
  animate: boolean
  $mode: DeviceMode
  $isDesktop: (mode: DeviceMode) => boolean
}>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0; /* The top value will be overwritten with the size of the locked controls */
  bottom: 0;
  right: 0;
  left: 0;
  will-change: transform;

  ${({ $mode, $isDesktop }) =>
    $isDesktop($mode) &&
    css`
      right: initial;
      left: initial;
      flex-direction: row-reverse;
    `}
  ${({ animate }) =>
    animate &&
    css`
      transition: transform 0.25s ease-in-out;
    `}
`

export const Drawer = styled.div<{
  $mode: DeviceMode
  $isDesktop: (mode: DeviceMode) => boolean
}>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  pointer-events: all;
  ${({ $mode, $isDesktop }) =>
    $isDesktop($mode) &&
    css`
      flex-direction: row-reverse;
    `}
`

export const DrawerContent = styled.div`
  display: flex;
  background-color: ${themeColor('tint', 'level1')};
  flex-direction: column;
  flex-grow: 1;
  max-width: 100%;
  min-height: 0;
  overflow-y: auto;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    width: ${MENU_WIDTH}px;
    box-shadow: 0 2px 0 2px rgba(0, 0, 0, 0.1);
  }
`
