// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export interface Option {
  value: string | string[]
  display: string
}

export type Filter = {
  name: string
  display: string
  options: Option[]
}

export type FilterKey =
  | 'category_slug'
  | 'department'
  | 'priority'
  | 'punctuality'
  | 'stadsdeel'
  | 'status'

export type DashboardFilter = Record<FilterKey, Option | undefined>
