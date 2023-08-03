// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import type { ReactNode } from 'react'
import { useState } from 'react'

import type { Confirm } from './context'
import { ConfirmationContext } from './context'
import ModalDialog from '../ModalDialog'

export type Props = {
  children: ReactNode
}
export const ConfirmationProvider = ({ children }: Props) => {
  const [confirm, setConfirm] = useState<Confirm>({
    prompt: '',
    title: '',
    isOpen: false,
    proceed: () => {},
    cancel: () => {},
  })

  return (
    <ConfirmationContext.Provider value={{ confirm, setConfirm }}>
      {children}
      <ModalDialog
        open={confirm.isOpen}
        onClose={confirm.cancel}
        title={confirm.title}
        isConfirmation
        onConfirm={confirm.proceed}
      >
        {confirm.prompt}
      </ModalDialog>
    </ConfirmationContext.Provider>
  )
}
