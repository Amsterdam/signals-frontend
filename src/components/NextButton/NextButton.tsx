// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { BaseSyntheticEvent, ReactNode } from 'react'

import styled from 'styled-components'

import Button from 'components/Button'

const StyledButton = styled(Button)`
  margin-right: 15px !important;
`

interface NextButtonProps {
  className?: string
  children: ReactNode
  onClick: (event: BaseSyntheticEvent) => void
}

const NextButton = ({ className = '', children, onClick }: NextButtonProps) => (
  <StyledButton
    className={className}
    data-testid="next-button"
    onClick={onClick}
    taskflow
    type="submit"
    variant="secondary"
  >
    {children}
  </StyledButton>
)

export default NextButton
