import type { Category } from 'types/category'

import type {
  CategoryFormValues,
  CategoryFormPatch,
  isEqualParams,
} from '../types'

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

export const isEqual = (
  {
    description,
    handling_message,
    is_active,
    name,
    sla,
    is_public_accessible,
  }: isEqualParams,
  othValue: Category
) =>
  [
    is_public_accessible === othValue.is_public_accessible,
    description === othValue.description,
    handling_message === othValue.handling_message,
    is_active === othValue.is_active,
    name === othValue.name,
    sla.n_days === othValue.sla.n_days,
    sla.use_calendar_days === othValue.sla.use_calendar_days,
  ].every(Boolean)
