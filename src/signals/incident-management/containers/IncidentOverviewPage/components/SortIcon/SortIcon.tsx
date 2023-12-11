// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Chevron } from './styled'
import type { SortOptions } from '../../contants'
import compareSortOptions from '../../utils'

export default function SortIcon({
  selectedSortOption,
  sortOption,
}: {
  sortOption: SortOptions
  selectedSortOption?: SortOptions
}) {
  /**
   * The sorting for created at differs from the other columns because the dates
   * are sorted from newest to oldest by default. The sorting differs for ID because
   * it chevrons behaviour needs to mimick that of the created at chevron. The
   * other columns are sorted alphabetically by from A to Z by default.
   */
  if (
    !selectedSortOption ||
    !compareSortOptions(selectedSortOption, sortOption)
  )
    return null

  const rotate = selectedSortOption?.startsWith('-')
  return (
    <Chevron
      data-testid={rotate ? 'chevron-down' : 'chevron-up'}
      $rotated={rotate}
    />
  )
}
