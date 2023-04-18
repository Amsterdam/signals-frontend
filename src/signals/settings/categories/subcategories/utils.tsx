// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { CategoryFormValues, CategoryFormPatch } from '../types'

export const getTransformedData = (
  formData: CategoryFormValues
): CategoryFormPatch => {
  // the API expect a different data structure than we initally received
  // data needs to be transformed before it is sent out 🙄
  const {
    name,
    is_active,
    description,
    handling_message,
    n_days,
    use_calendar_days,
    note,
    is_public_accessible,
    public_name,
  } = formData

  return {
    name,
    is_active,
    description,
    handling_message,
    new_sla: {
      n_days: n_days,
      use_calendar_days: Boolean(use_calendar_days),
    },
    note,
    is_public_accessible,
    public_name,
  }
}
