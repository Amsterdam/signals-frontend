// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { Control } from 'react-hook-form'
import { FieldType } from 'types/api/qa/question'

export type FormData = {
  [key: string]: unknown
}

export interface FieldProps {
  label: string
  errorMessage?: string
  id: string
  control: Control<FormData>
  register: any
  trigger: (id: string) => void
  rules?: { maxLength: unknown }
}

export type FormAnswer = {
  uuid: string
  fieldType?: FieldType
  value: unknown
}
