// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { CSSProperties, FunctionComponent } from 'react'
import { useCallback } from 'react'

import { Icon } from '@amsterdam/asc-ui'
import type { LatLngLiteral } from 'leaflet'

import type { Address } from 'types/address'

import type { Incident } from '../../types'
import { AddressLocation } from '../AddressLocation'
import { DetailPanel } from './DetailPanel'
import {
  ControlsContainer,
  Drawer,
  DrawerContainer,
  DrawerContent,
  DrawerContentWrapper,
  DrawerHandleDesktop,
  DrawerHandleMiniDesktop,
  DrawerHandleMobile,
  DrawerMapOverlay,
  HandleIcon,
} from './styled'
import type { ControlledContentProps } from './types'
import { DrawerState } from './types'
import { isMobile, isDesktop, useDeviceMode } from './utils'

const CONTROLS_PADDING = 32

export interface Props {
  ControlledContent?: React.ComponentType<ControlledContentProps>
  incident?: Incident
  onCloseDetailPanel: () => void
  onStateChange?: (state: DrawerState) => void
  state?: DrawerState
  setPin: (coordinates: LatLngLiteral) => void
  address?: Address
  setAddress: (address?: Address) => void
}

export const DrawerOverlay: FunctionComponent<Props> = ({
  children,
  ControlledContent = () => null,
  incident,
  onCloseDetailPanel,
  onStateChange,
  state = DrawerState.Closed,
  setPin,
  address,
  setAddress,
}) => {
  const mode = useDeviceMode()
  const DrawerHandle = isMobile(mode) ? DrawerHandleMobile : DrawerHandleDesktop

  function getDrawerPositionTransform(drawerState = state) {
    if (drawerState !== DrawerState.Open && !isMobile(mode)) {
      return `translateX(calc(-100% + 19px))`
    }

    if (drawerState !== DrawerState.Open && isMobile(mode)) {
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
    <DrawerMapOverlay $mode={mode}>
      <DrawerContainer $mode={mode} style={drawerContainerStyle} animate={true}>
        <Drawer $mode={mode}>
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
            {isDesktop(mode) ? (
              <DrawerHandleMiniDesktop>
                <Icon size={20}>
                  <HandleIcon $isOpen={state === DrawerState.Open} />
                </Icon>
              </DrawerHandleMiniDesktop>
            ) : null}
          </DrawerHandle>

          {incident && (
            <DetailPanel onClose={onCloseDetailPanel} incident={incident} />
          )}

          <DrawerContent style={drawerContentStyle} data-testid="drawerContent">
            <ControlsContainer $mode={mode}>
              <ControlledContent onClose={drawerClick} />
              <AddressLocation
                setCoordinates={setPin}
                address={address}
                setAddress={setAddress}
              />
            </ControlsContainer>
            <DrawerContentWrapper>{children}</DrawerContentWrapper>
          </DrawerContent>
        </Drawer>
      </DrawerContainer>
    </DrawerMapOverlay>
  )
}
