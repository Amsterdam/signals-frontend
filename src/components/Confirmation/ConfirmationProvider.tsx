// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import type { ReactNode } from 'react'
import { createContext, useState } from 'react'

import ModalDialog from '../ModelDialog'

type Confirm = {
  prompt: string
  title: string
  isOpen: boolean
  proceed: () => void
  cancel: () => void
}

export type State = {
  confirm: Confirm
  setConfirm: (arg0: Confirm) => void
}
export const ConfirmationContext = createContext<State>({} as State)

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
        isConfirmation={true}
        onConfirm={confirm.proceed}
      >
        {confirm.prompt}
      </ModalDialog>
    </ConfirmationContext.Provider>
  )
}
