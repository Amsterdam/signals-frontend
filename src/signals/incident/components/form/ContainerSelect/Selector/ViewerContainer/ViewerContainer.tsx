// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React, { Fragment, useContext } from 'react'
import type { ReactNode } from 'react'
import styled, { createGlobalStyle } from 'styled-components'

import {
  MapPanelContext,
  ViewerContainer as AscViewerContainer,
} from '@amsterdam/arm-core'

// Should reflect ViewerContainer props from arm-core (which are not exported)
interface ViewerContainerProps {
  topLeft?: ReactNode
  topRight?: ReactNode
  bottomLeft?: ReactNode
  bottomRight?: ReactNode
  metaData?: string[]
}

interface StyledViewerContainerProps {
  leftOffset: string
  height: string
}

// Prevent scrollBar on iOS due to navigation bar
const GlobalPanelStyle = createGlobalStyle`
  body {
    touch-action: none;
    overflow: hidden;
  }
`

const StyledViewerContainer = styled(
  AscViewerContainer
)<StyledViewerContainerProps>`
  left: ${({ leftOffset }) => leftOffset};
  height: ${({ height }) => height};
  z-index: 400;
  transition: height 0.3s ease-in-out;
`

const ViewerContainer: React.FC<ViewerContainerProps> = (props) => {
  const { drawerPosition, variant } = useContext(MapPanelContext)
  const isDrawerVariant = variant === 'panel'

  const height = isDrawerVariant ? '100%' : drawerPosition
  const leftOffset = isDrawerVariant ? drawerPosition : '0'

  return (
    <Fragment>
      <GlobalPanelStyle />
      <StyledViewerContainer
        {...props}
        data-testid="viewer-container"
        height={height}
        leftOffset={leftOffset}
      />
    </Fragment>
  )
}

export default ViewerContainer
