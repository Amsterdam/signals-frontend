// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'
import styled from 'styled-components'
import { Button, Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { Close } from '@amsterdam/asc-assets'

export const CloseButton = styled(Button)`
  border: none;
  padding: 0;
  width: 20px;
  height: 20px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${themeSpacing(3, 4, 3, 4)};
  margin: 0;
  border-bottom: 1px solid ${themeColor('tint', 'level5')};
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
      <CloseButton
        variant="application"
        onClick={onClose}
        icon={<Close />}
        size={20}
        title="Sluiten"
      />
    )}
  </Header>
)

export default ModalHeader
