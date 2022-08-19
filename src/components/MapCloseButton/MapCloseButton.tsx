/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2021 Gemeente Amsterdam */
import type { FunctionComponent } from 'react'
import { ControlButton } from '@amsterdam/arm-core'
import { Close } from '@amsterdam/asc-assets'

interface MapCloseButtonProps {
  className?: string
  onClick: () => void
}

const MAP_ICON_SIZE = 44

const MapCloseButton: FunctionComponent<MapCloseButtonProps & React.HTMLProps<HTMLElement>> = ({
  className,
  onClick,
  tabIndex
}) => (
  <ControlButton
    data-testid="mapCloseButton"
    icon={<Close />}
    onClick={onClick}
    size={MAP_ICON_SIZE}
    title="Sluiten"
    aria-label="Kaart sluiten"
    variant="blank"
    className={className}
    tabIndex={tabIndex}
  />
)

export default MapCloseButton
