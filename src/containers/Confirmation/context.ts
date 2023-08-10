// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { createContext } from 'react'

export type Confirm = {
  prompt: string
  title: string
  open: boolean
  proceed: () => void
  cancel: () => void
}

export type State = {
  confirm: Confirm
  setConfirm: (confirm: Confirm) => void
}
export const ConfirmationContext = createContext<State>({} as State)
