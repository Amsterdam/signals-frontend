// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
export interface CategoryDepartment {
  id: number
  code: string
  name: string
  is_intern: boolean
  is_responsible: boolean
  can_view: boolean
}

export interface Category {
  _links: {
    self: {
      href: string
      public: string
    }
    'sia:parent'?: {
      href: string | null
      public: string
    }
  }
  id: number | string
  name: string
  slug: string
  is_active: boolean
  description: string | null
  handling_message: string
  sla: {
    n_days: number | null
    use_calendar_days: boolean | null
  }
  departments: CategoryDepartment[]
  note: string | null
  is_public_accessible?: boolean
  public_name?: string | null
}
