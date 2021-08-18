// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
type Category = {
  name: string
  departments: string[]
}

export interface Report {
  total_signal_count: number
  results: { category: Category; signal_count: number }[]
}
