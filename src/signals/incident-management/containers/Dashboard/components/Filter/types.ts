// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

export type Option = {
  value: string
  display: string
}

export type Filter = {
  name: string
  display: string
  options: Option[]
}
