// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

let prevControls: string
let wasIsBlocking: boolean
/**
 * Clear blocking alert when the related control is not present anymore
 */
export async function clearBlockingAlert(
  controls: { [key: string]: unknown },
  trigger: any,
  errors: any
) {
  const currentControls = JSON.stringify(controls)
  const blockingControl: any = Object.values(controls).find((control: any) =>
    control?.options?.validators?.includes('isBlocking')
  )

  if (!blockingControl && prevControls !== currentControls && wasIsBlocking) {
    for (const key of Object.keys(errors)) {
      await trigger(key)
    }
  }

  if (blockingControl) {
    wasIsBlocking = true
  }

  prevControls = currentControls
}
