// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext } from 'react'

import type { State } from '../containers/Confirmation/context'
import { ConfirmationContext } from '../containers/Confirmation/context'

export const useConfirm = () => {
  const { confirm, setConfirm } = useContext<State>(ConfirmationContext)

  const isConfirmed = (title: string, prompt: string) => {
    const promise = new Promise<void>((resolve, reject) => {
      setConfirm({
        title,
        prompt,
        isOpen: true,
        proceed: resolve,
        cancel: reject,
      })
    })
    return promise.then(
      () => {
        setConfirm({ ...confirm, isOpen: false })
        return true
      },
      () => {
        setConfirm({ ...confirm, isOpen: false })
        return false
      }
    )
  }
  return {
    ...confirm,
    isConfirmed,
  }
}
