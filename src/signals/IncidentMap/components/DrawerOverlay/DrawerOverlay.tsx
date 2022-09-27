// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { CSSProperties, FunctionComponent } from 'react'

import { Icon } from '@amsterdam/asc-ui'

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
import type { ControlledContentProps, DeviceMode } from './utils'
import { isMobile, isDesktop, useDeviceMode } from './utils'

const CONTROLS_PADDING = 32

export interface ModeProp {
  // prefixing mode with $ to prevent prop bleeding through to the DOM
  $mode: DeviceMode
}

export enum DrawerState {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export enum FilterOrDetails {
  Filter = 'FILTER',
  Details = 'DETAILS',
}

interface Props {
  ControlledContent: React.ComponentType<ControlledContentProps>
  filterOrDetails: FilterOrDetails
  onControlClick: () => void
  onStateChange?: (state: DrawerState) => void
  showFilter: () => void
  state?: DrawerState
  incident: any
}

export const DrawerOverlay: FunctionComponent<Props> = ({
  children,
  ControlledContent,
  filterOrDetails,
  onControlClick,
  onStateChange,
  showFilter,
  state = DrawerState.Closed,
  incident,
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

  const drawerClick = () => {
    if (!onStateChange) {
      return
    }

    onStateChange(
      state === DrawerState.Closed ? DrawerState.Open : DrawerState.Closed
    )
  }

  return (
    <DrawerMapOverlay $mode={mode}>
      <DrawerContainer $mode={mode} style={drawerContainerStyle} animate={true}>
        <Drawer $mode={mode}>
          <DrawerHandle
            type="button"
            variant="blank"
            size={CONTROLS_PADDING}
            title="Open paneel"
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

          {filterOrDetails === FilterOrDetails.Details && (
            <DetailPanel onClose={showFilter} incident={incident} />
          )}

          <DrawerContent style={drawerContentStyle} data-testid="drawerContent">
            <ControlsContainer $mode={mode}>
              <ControlledContent
                onClose={() => {
                  drawerClick()
                  onControlClick()
                }}
              />
            </ControlsContainer>
            <DrawerContentWrapper>{children}</DrawerContentWrapper>
          </DrawerContent>
        </Drawer>
      </DrawerContainer>
    </DrawerMapOverlay>
  )
}
