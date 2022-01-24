// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import styled from 'styled-components'
import { breakpoint, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { MapPanelContext } from '@amsterdam/arm-core'

import type { FC, PropsWithChildren, HTMLAttributes } from 'react'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'

import useLayerVisible from '../../hooks/useLayerVisible'

export const MessageStyle = styled.div<{ leftOffset?: string }>`
  background-color: ${themeColor('support', 'focus')};
  height: auto;
  margin: ${themeSpacing(4, 0)};
  min-height: ${themeSpacing(11)};
  padding: ${themeSpacing(3, 4, 3, 4)};
  position: absolute;
  z-index: 400;
  left: calc(${({ leftOffset }) => leftOffset || '0px'} + ${themeSpacing(4)});
  top: calc(${themeSpacing(4)} + ${themeSpacing(11)});
  width: auto;

  @media only screen and ${breakpoint('max-width', 'tabletS')} {
    max-width: calc(100vw - (44px + 16px + 16px + 16px));
  }
`

const MessageOverlay: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  ...rest
}) => {
  const { drawerPosition, variant } = useContext(MapPanelContext)
  const isDrawerVariant = variant === 'panel'
  const leftOffset = isDrawerVariant ? drawerPosition : '0px'

  return (
    <MessageStyle leftOffset={leftOffset} {...rest}>
      {children}
    </MessageStyle>
  )
}

interface ZoomMessageProps {
  zoomLevel: ZoomLevel
}

export const ZoomMessage: FC<PropsWithChildren<ZoomMessageProps>> = ({
  zoomLevel,
  ...props
}) => {
  const layerVisible = useLayerVisible(zoomLevel)

  if (layerVisible) return null

  return <MessageOverlay data-testid="zoomMessage" {...props} />
}

export const MapMessage: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> =
  (props) => <MessageOverlay data-testid="mapMessage" {...props} />
