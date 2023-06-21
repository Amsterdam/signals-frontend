// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

let lastControls: string[] = []
const lastBlockingControlNames: { [key: string]: boolean } = {}

/**
 * Clear blocking alert when the related control is not present anymore
 * @param controls - current controls
 * @param clearErrors - function to clear errors
 */
export function clearBlockingAlert(controls: any, clearErrors: any) {
  const currentControls = controls

  let currentBlockingControlName = ''

  const currentControlName = getCurrentControlName(
    Object.keys(currentControls),
    Object.keys(lastControls)
  )

  const blockingControl: any = Object.values(controls).find((control: any) =>
    control?.options?.validators?.includes('isBlocking')
  )

  // if blocking control is present, set currentBlockingControlName
  if (blockingControl?.meta?.name) {
    currentBlockingControlName = blockingControl.meta.name
    lastBlockingControlNames[currentBlockingControlName] = true
  }

  if (
    currentControlName &&
    lastBlockingControlNames[currentControlName] &&
    !currentBlockingControlName
  ) {
    clearErrors(currentControlName)
    lastBlockingControlNames[currentControlName] = false
  }

  lastControls = currentControls
}

// get current control name from newKeys and oldKeys where newKey is a prefix of oldKey
// this is needed to clear the errors coming from the previous control
function getCurrentControlName(
  newKeys: string[],
  oldKeys: string[]
): string | undefined {
  return oldKeys.find((oldKey) => {
    return newKeys.some((newKey) => {
      return oldKey.startsWith(newKey) && oldKey !== newKey
    })
  })
}
