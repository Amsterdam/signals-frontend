// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import { Info } from '@amsterdam/asc-assets'
import { themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'

export interface LegendToggleButtonProps {
  className?: string
  isOpen: boolean
  onClick: () => void
  legendButtonRef: React.ForwardedRef<HTMLButtonElement>
}

const StyledButton = styled(Button)`
  min-width: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  color: ${themeColor('tint', 'level7')};
  font-family: inherit;

  svg path {
    fill: currentColor;
  }
`

const LegendToggleButton: FC<LegendToggleButtonProps> = ({
  className,
  isOpen,
  onClick,
  legendButtonRef,
}) => (
  <StyledButton
    aria-controls="legendPanel"
    aria-expanded={isOpen}
    className={className}
    data-testid="legend-toggle-button"
    onClick={onClick}
    iconLeft={<Info />}
    tabIndex={0}
    type="button"
    variant="blank"
    ref={legendButtonRef}
  >
    Legenda
  </StyledButton>
)

export default LegendToggleButton
