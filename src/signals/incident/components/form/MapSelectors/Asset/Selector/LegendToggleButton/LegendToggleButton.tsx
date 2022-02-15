// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import styled from 'styled-components'

import type { FC } from 'react'

import Button from 'components/Button'

export interface LegendToggleButtonProps {
  className?: string
  onClick: () => void
}

const StyledButton = styled(Button)`
  min-width: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);

  svg path {
    fill: currentColor;
  }
`

const LegendToggleButton: FC<LegendToggleButtonProps> = ({
  className,
  onClick,
}) => (
  <StyledButton
    className={className}
    type="button"
    variant="blank"
    onClick={onClick}
  >
    Uitleg
  </StyledButton>
)

export default LegendToggleButton
