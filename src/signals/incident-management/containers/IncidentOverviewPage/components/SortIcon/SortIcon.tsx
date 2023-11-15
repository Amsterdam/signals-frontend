// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { StyledChevronUp } from './styled'
import { SortOptions } from '../../contants'
import compareSortOptions from '../../utils'

export default function SortIcon({
  ordering,
  sortOption,
}: {
  sortOption: SortOptions
  ordering?: SortOptions
}) {
  /**
   * The sorting for created at differs from the other columns because the dates
   * are sorted from newest to oldest by default. The other columns are sorted
   * alphabetically by from A to Z by default.
   */
  return ordering && compareSortOptions(ordering, sortOption) ? (
    (ordering.startsWith('-') && ordering !== SortOptions.CREATED_AT_ASC) ||
    ordering === SortOptions.CREATED_AT_DESC ? (
      <StyledChevronUp data-testid={'chevron-up'} $rotated={false} />
    ) : (
      <StyledChevronUp data-testid={'chevron-down'} $rotated />
    )
  ) : null
}
