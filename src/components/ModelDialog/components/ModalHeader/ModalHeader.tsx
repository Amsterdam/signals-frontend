// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { Close } from '@amsterdam/asc-assets'
import { Button } from '@amsterdam/asc-ui'

import { StyledHeading, Header } from './styled'

export type Props = {
  title: string
  onClose: () => void
}

export const ModalHeader = ({ title, onClose }: Props) => (
  <Header data-testid="modal-header">
    <StyledHeading as="h3" data-testid="modal-title">
      {title}
    </StyledHeading>
    <Button
      square
      variant="blank"
      onClick={onClose}
      icon={<Close />}
      iconSize={20}
      size={32}
      title="Sluiten"
    />
  </Header>
)
