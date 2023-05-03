// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
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
    'sia:icon'?: {
      href: string
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
  _display?: string
  sub_categories?: SubCategory[]
  configuration?: {
    show_children_in_filter?: boolean
  }
}

export interface SubCategory {
  name: string
  slug: string
  _display: string
  filterActive: boolean
  is_public_accessible: boolean
  _links: {
    'sia:icon'?: {
      href: string
    }
  }
}
