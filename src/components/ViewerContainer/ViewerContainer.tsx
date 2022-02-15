// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { ReactNode, FunctionComponent } from 'react'
import styled from 'styled-components'

import { ViewerContainer as AscViewerContainer } from '@amsterdam/arm-core'

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
  z-index: 400;
  transition: height 0.3s ease-in-out;
  touch-action: none;
  overflow: hidden;
`

const ViewerContainer: FunctionComponent<ViewerContainerProps> = (props) => (
  <StyledViewerContainer {...props} data-testid="viewer-asset" />
)

export default ViewerContainer
