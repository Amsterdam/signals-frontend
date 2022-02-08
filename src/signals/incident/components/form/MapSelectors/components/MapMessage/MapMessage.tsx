// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { MapPanelContext } from '@amsterdam/arm-core'
import { Close } from '@amsterdam/asc-assets'

import type {
  FC,
  PropsWithChildren,
  HTMLAttributes,
  MouseEventHandler,
} from 'react'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'

import useLayerVisible from '../../hooks/useLayerVisible'

export const MessageStyle = styled.div<{ leftOffset?: string }>`
  height: auto;
  margin: ${themeSpacing(4, 0, 0)};
  min-height: ${themeSpacing(11)};
  padding: ${themeSpacing(3, 4, 3, 4)};
  z-index: 400;
  align-self: flex-start;
  position: relative;
`

const ZoomMessageStyle = styled(MessageStyle)`
  background-color: ${themeColor('support', 'focus')};
  color: black;
`

const CloseIcon = styled(Close)`
  position: absolute;
  top: ${themeSpacing(3)};
  right: ${themeSpacing(4)};

  &:hover {
    cursor: pointer;
  }
`

const MapMessageStyle = styled(MessageStyle)<{ leftOffset?: string }>`
  background-color: ${themeColor('primary')};
  color: white;
  padding-right: calc(16px + 16px + 22px);
`

type MessageType = 'map' | 'zoom'

interface ZoomMessageProps {
  zoomLevel: ZoomLevel
}

const MessageOverlay: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>> & { type: MessageType }
> = ({ children, type, ...rest }) => {
  const { drawerPosition, variant } = useContext(MapPanelContext)
  const isDrawerVariant = variant === 'panel'
  const leftOffset = isDrawerVariant ? drawerPosition : '0px'

  const Component = type === 'zoom' ? ZoomMessageStyle : MapMessageStyle

  return (
    <Component leftOffset={leftOffset} {...rest}>
      {children}
    </Component>
  )
}

export const ZoomMessage: FC<PropsWithChildren<ZoomMessageProps>> = ({
  zoomLevel,
  ...props
}) => {
  const layerVisible = useLayerVisible(zoomLevel)

  if (layerVisible) return null

  return <MessageOverlay {...props} data-testid="zoomMessage" type="zoom" />
}

interface MapMessageProps
  extends PropsWithChildren<Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>> {
  onClick: MouseEventHandler<SVGElement>
}

export const MapMessage: FC<MapMessageProps> = ({
  children,
  onClick,
  ...props
}) => (
  <MessageOverlay {...props} data-testid="mapMessage" type="map">
    {children}
    <CloseIcon onClick={onClick} width={22} fill="white" role="button" />
  </MessageOverlay>
)
