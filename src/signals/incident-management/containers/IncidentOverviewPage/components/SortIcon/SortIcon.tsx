// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ChevronDown, ChevronUp } from '@amsterdam/asc-assets'

import { SortOptions } from '../contants'

export default function SortIcon({
  ordering,
  sortOption,
}: {
  sortOption: SortOptions
  ordering?: SortOptions
}) {
  return ordering &&
    ordering.replace('-', '') === sortOption.replace('-', '') ? (
    (ordering.startsWith('-') && ordering !== SortOptions.CREATED_AT_ASC) ||
    ordering === SortOptions.CREATED_AT_DESC ? (
      <ChevronUp data-testid={'chevron-up'} />
    ) : (
      <ChevronDown data-testid={'chevron-down'} />
    )
  ) : null
}
