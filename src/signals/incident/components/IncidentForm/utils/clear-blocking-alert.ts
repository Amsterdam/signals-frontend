// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

let lastControls = ''
let lastBlockingControlName = ''

export function clearBlockingAlert(controls: any, clearErrors: any) {
  const currentControls = JSON.stringify(controls)
  let currentBlockingControlName = ''

  const blockingControl: any = Object.values(controls).find((control: any) =>
    control?.options?.validators?.includes('isBlockingAnswer')
  )

  if (blockingControl?.meta) {
    currentBlockingControlName = blockingControl.meta.name
  }

  if (
    (lastControls.includes('isBlockingAnswer') &&
      !currentControls.includes('isBlockingAnswer') &&
      lastBlockingControlName &&
      lastBlockingControlName !== currentBlockingControlName) ||
    (currentBlockingControlName && !lastBlockingControlName)
  ) {
    clearErrors(lastBlockingControlName)
  }
  if (currentBlockingControlName) {
    lastBlockingControlName = currentBlockingControlName
  }
  lastControls = currentControls
}
