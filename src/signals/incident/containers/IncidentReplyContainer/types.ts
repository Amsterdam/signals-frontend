// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { Control } from 'react-hook-form'

import type { FieldType } from 'types/api/qa/question'

export interface FieldProps {
  label: string
  shortLabel: string
  errorMessage?: string
  id: string
  control: Control<Record<string, unknown>>
  register: any
  trigger: (id: string) => void
  rules?: { maxLength: unknown }
}

export type FormAnswer = {
  uuid: string
  fieldType?: FieldType
  value: FileList | string
}
