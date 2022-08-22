// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import styled from 'styled-components'
import { themeColor } from '@amsterdam/asc-ui'

import type { FC } from 'react'

import Button from 'components/Button'

export interface LegendToggleButtonProps {
  className?: string
  isOpen: boolean
  onClick: () => void
}

const StyledButton = styled(Button)`
  min-width: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  color: ${themeColor('tint', 'level7')};

  svg path {
    fill: currentColor;
  }
`

const LegendToggleButton: FC<LegendToggleButtonProps> = ({
  className,
  isOpen,
  onClick,
}) => (
  <StyledButton
    aria-controls="legendPanel"
    aria-expanded={isOpen}
    className={className}
    data-testid="legendToggleButton"
    onClick={onClick}
    tabIndex={0}
    type="button"
    variant="blank"
  >
    Uitleg
  </StyledButton>
)

export default LegendToggleButton
