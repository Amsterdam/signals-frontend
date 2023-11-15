// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { SortOptions } from '../../contants'
import SortIcon from '../SortIcon'

const ThComponent = ({
  ordering,
  changeOrder,
  sortOption,
  headerText,
  StyledComponent,
}: {
  ordering?: SortOptions
  changeOrder: (column: SortOptions) => void
  sortOption: SortOptions
  headerText: string
  StyledComponent: any
}) => {
  return (
    <StyledComponent onClick={() => changeOrder(sortOption)}>
      {headerText}
      <SortIcon ordering={ordering} sortOption={sortOption} />
    </StyledComponent>
  )
}

export default ThComponent
