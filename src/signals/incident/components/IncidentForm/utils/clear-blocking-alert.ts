// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

let prevControls: string
let formHasBlockingValidators: boolean
/**
 * Clear blocking alert when the related control is not present anymore
 */
export async function clearBlockingAlert(
  controls: { [key: string]: unknown },
  trigger: (key: string) => Promise<boolean>,
  errors: { [key: string]: unknown }
) {
  const currentControls = JSON.stringify(controls)
  const blockingControl: any = Object.values(controls).find((control: any) =>
    control?.options?.validators?.includes('isBlocking')
  )

  if (
    !blockingControl &&
    prevControls !== currentControls &&
    formHasBlockingValidators
  ) {
    for (const key of Object.keys(errors)) {
      await trigger(key)
      formHasBlockingValidators = false
    }
  }

  if (blockingControl) {
    formHasBlockingValidators = true
  }

  prevControls = currentControls
}
