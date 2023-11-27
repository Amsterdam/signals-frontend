// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { StyledChevronUp } from './styled'
import { SortOptions } from '../../contants'
import compareSortOptions from '../../utils'

const sortException = (sortOption: SortOptions) => {
  return (
    sortOption === SortOptions.CREATED_AT_ASC ||
    sortOption === SortOptions.CREATED_AT_DESC ||
    sortOption === SortOptions.ID_DESC ||
    sortOption === SortOptions.ID_ASC
  )
}
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

  if (sortException(sortOption)) {
    const rotateOne = selectedSortOption?.startsWith('-') ? true : false
    return (
      <StyledChevronUp
        data-testid={rotateOne ? 'chevron-down' : 'chevron-up'}
        $rotated={rotateOne}
      />
    )
  }

  const rotate = selectedSortOption?.startsWith('-') ? false : true
  return (
    <StyledChevronUp
      data-testid={rotate ? 'chevron-down' : 'chevron-up'}
      $rotated={rotate}
    />
  )
}
