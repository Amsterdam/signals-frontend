// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { SortOptions } from './contants'

export function compareSortOptions(a: SortOptions, b: SortOptions) {
  return a.replace('-', '') === b.replace('-', '')
}

export const sortException = (sortOption: SortOptions) => {
  /** Priority is based on alphabetical order, therefore chevron should be reversed. */
  return (
    sortOption === SortOptions.PRIORITY_ASC ||
    sortOption === SortOptions.PRIORITY_DESC
  )
}
