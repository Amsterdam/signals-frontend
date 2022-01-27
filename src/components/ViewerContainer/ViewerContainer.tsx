// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import type { ReactNode, FunctionComponent } from 'react'
import styled from 'styled-components'

import {
  MapPanelContext,
  ViewerContainer as AscViewerContainer,
} from '@amsterdam/arm-core'

// Should reflect ViewerContainer props from arm-core (which are not exported)
interface ViewerContainerProps {
  className?: string
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

const StyledViewerContainer = styled(
  AscViewerContainer
)<StyledViewerContainerProps>`
  left: ${({ leftOffset }) => leftOffset};
  height: ${({ height }) => height};
  z-index: 400;
  transition: height 0.3s ease-in-out;
  touch-action: none;
  overflow: hidden;
`

const ViewerContainer: FunctionComponent<ViewerContainerProps> = (props) => {
  const { drawerPosition, variant } = useContext(MapPanelContext)
  const isDrawerVariant = variant === 'panel'

  const height = isDrawerVariant ? '100%' : drawerPosition
  const leftOffset = isDrawerVariant ? drawerPosition : '0'

  return (
    <StyledViewerContainer
      {...props}
      data-testid="viewer-asset"
      height={height}
      leftOffset={leftOffset}
    />
  )
}

export default ViewerContainer
