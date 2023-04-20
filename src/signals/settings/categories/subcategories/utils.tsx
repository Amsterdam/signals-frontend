// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type {
  CategoryFormValues,
  CategoryFormPayload,
  DirtyFields,
} from '../types'

export const getPatchPayload = (
  formData: CategoryFormValues,
  dirtyFields: DirtyFields
): CategoryFormPayload => {
  const payload = Object.keys(dirtyFields).map((key) => {
    return {
      [key]: formData[key as keyof CategoryFormValues],
    }
  })

  const payloadObject = Object.assign({}, ...payload)

  if (payloadObject['n_days'] || payloadObject['use_calendar_days']) {
    const updatedPayload = {
      ...payloadObject,
      new_sla: {
        n_days: payloadObject.n_days ?? formData.n_days,
        use_calendar_days: Boolean(Number(payloadObject.use_calendar_days)),
      },
    }

    delete updatedPayload['n_days']
    delete updatedPayload['use_calendar_days']

    return updatedPayload
  } else return payloadObject
}
