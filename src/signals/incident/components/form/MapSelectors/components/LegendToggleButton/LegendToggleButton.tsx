// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useContext } from 'react'
import styled from 'styled-components'

import { MapPanelContext } from '@amsterdam/arm-core'
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants'
import Button from 'components/Button'

export interface LegendToggleButtonProps {
  isRenderingLegendPanel: boolean
  onClick: () => void
}

const StyledButton = styled(Button)`
  min-width: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);

  svg path {
    fill: currentColor;
  }
`

const LegendToggleButton: FunctionComponent<LegendToggleButtonProps> = ({
  onClick,
  isRenderingLegendPanel,
}) => {
  const { setPositionFromSnapPoint, matchPositionWithSnapPoint } =
    useContext(MapPanelContext)

  const isDrawerOpen = !matchPositionWithSnapPoint(SnapPoint.Closed)
  const isLegendPanelOpen = isDrawerOpen && isRenderingLegendPanel
  const buttonVariant = isLegendPanelOpen ? 'secondary' : 'blank'

  const toggleLegend = () => {
    setPositionFromSnapPoint(
      isLegendPanelOpen ? SnapPoint.Closed : SnapPoint.Halfway
    )
    onClick()
  }

  return (
    <StyledButton type="button" variant={buttonVariant} onClick={toggleLegend}>
      Legenda
    </StyledButton>
  )
}

export default LegendToggleButton
