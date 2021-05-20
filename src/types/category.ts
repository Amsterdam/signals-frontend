// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
interface CategoryDepartment {
  id: number
  code: string
  name: string
  is_intern: boolean
  is_responsible: boolean
  can_view: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  is_active: boolean
  description: string
  handling_message: string
  sla: {
    n_days: number
    use_calendar_days: boolean
  }
  departments: CategoryDepartment[]
  note: string | null
}
