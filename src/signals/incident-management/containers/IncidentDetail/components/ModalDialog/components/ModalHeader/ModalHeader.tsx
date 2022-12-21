// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import type { FC } from 'react'

import { Close } from '@amsterdam/asc-assets'
import { Button, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Header = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeColor('tint', 'level5')};
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: ${themeSpacing(3, 4)};
`

export const StyledHeading = styled(Heading)`
  margin: 0;
`

interface ModalHeaderProps {
  title: string
  onClose?: () => void
}

const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose }) => (
  <Header data-testid="modalHeader">
    <StyledHeading as="h3" data-testid="modalTitle">
      {title}
    </StyledHeading>
    {onClose && (
      <Button
        square
        variant="blank"
        onClick={onClose}
        icon={<Close />}
        iconSize={20}
        size={32}
        title="Sluiten"
      />
    )}
  </Header>
)

export default ModalHeader
