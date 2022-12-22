// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import type { FieldType } from 'types/api/qa/question'

export type FormAnswer = {
  uuid: string
  fieldType?: FieldType
  value: string | FileList
}
