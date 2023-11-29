// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ElementType } from 'react'

import type { SortOptions } from '../../contants'
import SortIcon from '../SortIcon'

const ThComponent = ({
  ordering,
  changeOrder,
  sortOption,
  headerText,
  StyledComponent,
  sortingDisabled,
}: {
  ordering?: SortOptions
  changeOrder: (column: SortOptions) => void
  sortOption: SortOptions
  headerText: string
  StyledComponent: ElementType
  sortingDisabled?: boolean
}) => {
  return (
    <StyledComponent
      onClick={() => !sortingDisabled && changeOrder(sortOption)}
      $isDisabled={sortingDisabled}
    >
      {headerText}
      <SortIcon ordering={ordering} sortOption={sortOption} />
    </StyledComponent>
  )
}

export default ThComponent
