// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Chevron } from './styled'
import type { SortOptions } from '../../contants'
import { compareSortOptions, sortException } from '../../utils'

export default function SortIcon({
  selectedSortOption,
  sortOption,
}: {
  sortOption: SortOptions
  selectedSortOption?: SortOptions
}) {
  if (
    !selectedSortOption ||
    !compareSortOptions(selectedSortOption, sortOption)
  )
    return null

  if (sortException(sortOption)) {
    const rotateException = !selectedSortOption?.startsWith('-')
    return (
      <Chevron
        data-testid={rotateException ? 'chevron-up' : 'chevron-down'}
        $rotated={rotateException}
      />
    )
  }

  const rotate = selectedSortOption?.startsWith('-')
  return (
    <Chevron
      data-testid={rotate ? 'chevron-down' : 'chevron-up'}
      $rotated={rotate}
    />
  )
}
