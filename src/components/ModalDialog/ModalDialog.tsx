// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 -2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { ReactNode } from 'react'

import { ModalContent } from './components/ModalContent'
import { ModalHeader } from './components/ModalHeader'
import { StyledFormFooter, StyledModal } from './styled'

export type ModalDialogProps = {
  cancelBtnLabel?: string
  children?: ReactNode
  isConfirmation?: boolean
  onClose: () => void
  onConfirm?: () => void
  open?: boolean
  title: string
  submitBtnLabel?: string
  $hasIframe?: boolean
}

const ModalDialog = ({
  cancelBtnLabel = 'Annuleer',
  children,
  isConfirmation = false,
  onClose,
  onConfirm,
  open = true,
  submitBtnLabel = 'Bevestig',
  title,
  $hasIframe = false,
}: ModalDialogProps) => (
  <StyledModal
    open={open}
    onClose={onClose}
    data-testid="modal-dialog"
    $hasIframe={$hasIframe}
  >
    <ModalHeader title={title} onClose={onClose} />
    <ModalContent $hasIframe={$hasIframe}>{children}</ModalContent>
    {isConfirmation && (
      <StyledFormFooter
        cancelBtnLabel={cancelBtnLabel}
        onCancel={onClose}
        submitBtnLabel={submitBtnLabel}
        onSubmitForm={onConfirm}
        inline={true}
      />
    )}
  </StyledModal>
)

export default ModalDialog
