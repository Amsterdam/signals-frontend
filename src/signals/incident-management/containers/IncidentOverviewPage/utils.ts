// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { SortOptions } from './contants'

export default function compareSortOptions(a: SortOptions, b: SortOptions) {
  return a.replace('-', '') === b.replace('-', '')
}
