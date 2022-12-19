// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { ReactNode, FunctionComponent } from 'react'

import { ViewerContainer as AscViewerContainer } from '@amsterdam/arm-core'
import styled from 'styled-components'

// Should reflect ViewerContainer props from arm-core (which are not exported)
interface ViewerContainerProps {
  className?: string
  topLeft?: ReactNode
  topRight?: ReactNode
  bottomLeft?: ReactNode
  bottomRight?: ReactNode
  metaData?: string[]
}

const StyledViewerContainer = styled(AscViewerContainer)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  touch-action: none;
  pointer-events: none;
  z-index: 400;
`

const ViewerContainer: FunctionComponent<ViewerContainerProps> = (props) => (
  <StyledViewerContainer {...props} data-testid="viewer-asset" />
)

export default ViewerContainer
