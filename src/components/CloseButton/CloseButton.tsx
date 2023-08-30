// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { Close as CloseIcon } from '@amsterdam/asc-assets'

import { StyledButton } from './styled'

interface Props {
  className?: string
  close?: () => void
}

const CloseButton = ({ className = '', close }: Props) => (
  <StyledButton
    className={className}
    data-testid="close-button"
    aria-label="Sluiten"
    icon={<CloseIcon />}
    iconSize={16}
    onClick={close}
    size={32}
    variant="application"
  />
)

export default CloseButton
