// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 -2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { ReactNode } from 'react'

import { ModalContent } from './components/ModalContent'
import { ModalHeader } from './components/ModalHeader'
import { StyledFormFooter, StyledModal } from './styled'

export type ModalDialogProps = {
  onClose: () => void
  title: string
  onConfirm?: () => void
  children?: ReactNode
  isConfirmation: boolean
}

const ModalDialog = ({
  onClose,
  onConfirm,
  title,
  isConfirmation = false,
  children,
}: ModalDialogProps) => (
  <StyledModal open onClose={onClose}>
    <ModalHeader title={title} onClose={onClose} />
    <ModalContent>{children}</ModalContent>
    {isConfirmation && (
      <StyledFormFooter
        cancelBtnLabel="Annuleer"
        onCancel={onClose}
        submitBtnLabel="Bevestig"
        onSubmitForm={onConfirm}
        inline={true}
      />
    )}
  </StyledModal>
)

export default ModalDialog
