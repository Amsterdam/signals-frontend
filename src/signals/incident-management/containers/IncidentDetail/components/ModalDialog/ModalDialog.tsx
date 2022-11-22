// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import type { FunctionComponent } from 'react'

import { Modal } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import ModalHeader from './components/ModalHeader/ModalHeader'

const StyledModal = styled(Modal)`
  overflow: hidden;
  height: 75%;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  * {
    box-sizing: border-box;
  }
`

interface ModalDialogProps {
  onClose: () => void
  title: string
}

const ModalDialog: FunctionComponent<ModalDialogProps> = ({
  onClose,
  title,
  children,
}) => (
  <StyledModal open onClose={onClose}>
    <ModalHeader title={title} onClose={onClose} />
    <ModalContent>{children}</ModalContent>
  </StyledModal>
)

export default ModalDialog
