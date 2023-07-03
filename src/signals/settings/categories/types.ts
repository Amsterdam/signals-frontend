// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { StandardText } from '../../../types/api/standard-texts'

export interface CategoryFormValues {
  description: string | null
  handling_message: string
  is_active: string
  is_public_accessible: boolean
  n_days: number | null
  name: string
  note: string | null
  public_name: string
  use_calendar_days: number
  show_children_in_filter?: boolean
  standard_texts?: StandardText[]
}

export interface CategoryFormPayload {
  description: string | null
  handling_message: string
  is_active: string
  is_public_accessible: boolean
  name: string
  new_sla: {
    n_days: number | null
    use_calendar_days: boolean | null
  }
  note: string | null
  public_name: string
  configuration: {
    show_children_in_filter: boolean
  }
}

export enum Direction {
  Up = 'up',
  Down = 'down',
}
