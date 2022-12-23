// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { ChevronLeft } from '@amsterdam/asc-assets'
import { themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'

const StyledButton = styled(Button)`
  height: 44px;
  align-self: auto;
`

const Chevron = styled(ChevronLeft)`
  fill: ${themeColor('primary')};
`

interface PreviousButtonProps {
  className?: string
  children: ReactNode
  onClick: () => void
}

const PreviousButton = ({
  className,
  children,
  onClick,
}: PreviousButtonProps) => (
  <StyledButton
    className={className}
    data-testid="previous-button"
    iconLeft={<Chevron aria-hidden="true" />}
    iconSize={14}
    onClick={onClick}
    type="button"
    variant="textButton"
  >
    {children}
  </StyledButton>
)

export default PreviousButton
