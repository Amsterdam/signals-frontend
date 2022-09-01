// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components'
import { ChevronLeft } from '@amsterdam/asc-assets'
import { themeColor } from '@amsterdam/asc-ui'
import Button from 'components/Button'

const StyledButton = styled(Button)`
  height: 44px;
  align-self: auto;
`

const Chevron = styled(ChevronLeft)`
  fill: ${themeColor('primary')};
`

export interface PreviousButtonProps {
  className?: string
  children: ReactNode
  onClick: () => void
}

const PreviousButton: FunctionComponent<PreviousButtonProps> = ({
  className,
  children,
  onClick,
}) => (
  <StyledButton
    className={className}
    data-testid="previousButton"
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
