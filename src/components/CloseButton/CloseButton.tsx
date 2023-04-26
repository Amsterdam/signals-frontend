// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { Close as CloseIcon } from '@amsterdam/asc-assets'

import { StyledButton } from './styled'

interface CloseButtonProps {
  className?: string
  close?: () => void
}

const CloseButton = ({ className = '', close }: CloseButtonProps) => (
  <StyledButton
    className={className}
    data-testid="close-button"
    icon={<CloseIcon />}
    iconSize={16}
    onClick={close}
    size={32}
    variant="application"
  />
)

export default CloseButton
