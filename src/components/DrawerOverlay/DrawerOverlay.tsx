// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022-2023 Gemeente Amsterdam
import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useCallback } from 'react'

import { Icon } from '@amsterdam/asc-ui'

import { useDeviceMode } from 'hooks/useDeviceMode'

import {
  Drawer,
  DrawerContainer,
  DrawerContent,
  DrawerHandleDesktop,
  DrawerHandleMiniDesktop,
  DrawerHandleMobile,
  DrawerMapOverlay,
  HandleIcon,
} from './styled'
import { DrawerState } from './types'
import type { Incident } from '../../signals/IncidentMap/types'
import type { Address } from '../../types/address'

const CONTROLS_PADDING = 32

export interface Props {
  children: ReactNode
  onCloseDetailPanel?: () => void
  incident?: Incident
  DetailPanel?: ElementType
  onStateChange?: (state: DrawerState) => void
  state?: DrawerState
  disableDrawerHandleDesktop?: boolean
  topPositionDrawerMobile?: number
  address?: Address
}

export const DrawerOverlay = ({
  children,
  incident,
  onCloseDetailPanel,
  onStateChange,
  state = DrawerState.Closed,
  DetailPanel,
  disableDrawerHandleDesktop = false,
  topPositionDrawerMobile,
  address,
}: Props) => {
  const { deviceMode, isDesktop, isMobile } = useDeviceMode()

  const DrawerHandle = isMobile(deviceMode)
    ? DrawerHandleMobile
    : DrawerHandleDesktop

  function getDrawerPositionTransform(drawerState = state) {
    if (drawerState !== DrawerState.Open && !isMobile(deviceMode)) {
      return `translateX(calc(-100% + 19px))`
    }

    if (drawerState !== DrawerState.Open && isMobile(deviceMode)) {
      return `translateY(calc(100% - 40px))`
    }

    return ''
  }

  const drawerContainerStyle: CSSProperties = {}
  const drawerContentStyle: CSSProperties = {}

  drawerContainerStyle.transform = getDrawerPositionTransform()

  const drawerClick = useCallback(() => {
    onStateChange &&
      onStateChange(
        state === DrawerState.Closed ? DrawerState.Open : DrawerState.Closed
      )
  }, [onStateChange, state])

  return (
    <DrawerMapOverlay
      $mode={deviceMode}
      $isDesktop={isDesktop}
      $topMobile={topPositionDrawerMobile}
      $address={address}
    >
      <DrawerContainer
        $mode={deviceMode}
        $isDesktop={isDesktop}
        style={drawerContainerStyle}
        animate={true}
      >
        <Drawer $mode={deviceMode} $isDesktop={isDesktop}>
          <DrawerHandle
            type="button"
            variant="blank"
            size={CONTROLS_PADDING}
            title="Toggle paneel"
            aria-label={
              state === DrawerState.Open ? 'Paneel sluiten' : 'Paneel openen'
            }
            onClick={drawerClick}
          >
            {isDesktop(deviceMode) && !disableDrawerHandleDesktop ? (
              <DrawerHandleMiniDesktop>
                <Icon size={20}>
                  <HandleIcon $isOpen={state === DrawerState.Open} />
                </Icon>
              </DrawerHandleMiniDesktop>
            ) : null}
          </DrawerHandle>

          {incident && DetailPanel && (
            <DetailPanel onClose={onCloseDetailPanel} incident={incident} />
          )}

          <DrawerContent style={drawerContentStyle} data-testid="drawerContent">
            {children}
          </DrawerContent>
        </Drawer>
      </DrawerContainer>
    </DrawerMapOverlay>
  )
}
