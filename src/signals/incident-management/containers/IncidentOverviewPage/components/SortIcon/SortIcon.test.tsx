// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'

import SortIcon from './SortIcon'
import { SortOptions } from '../../contants'

describe('SortIcon', () => {
  it('should render a sort icon for created at asc when its desc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.CREATED_AT_ASC}
        selectedSortOption={SortOptions.CREATED_AT_DESC}
      />
    )

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
  })

  it('should render a sort icon for created at desc when its asc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.CREATED_AT_DESC}
        selectedSortOption={SortOptions.CREATED_AT_ASC}
      />
    )

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
  })

  it('should render a sort icon for id when its desc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ID_ASC}
        selectedSortOption={SortOptions.ID_DESC}
      />
    )

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
  })

  it('should render a sort icon for ID when its asc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ID_DESC}
        selectedSortOption={SortOptions.ID_ASC}
      />
    )

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
  })

  // and now for address
  it('should render a sort icon for address asc when its desc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ADDRESS_ASC}
        selectedSortOption={SortOptions.ADDRESS_DESC}
      />
    )

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
  })

  it('should render a sort icon for address desc when its asc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ADDRESS_DESC}
        selectedSortOption={SortOptions.ADDRESS_ASC}
      />
    )

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
  })

  it('should return null when there is no match between sortOption and selectedSortOption', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ADDRESS_ASC}
        selectedSortOption={SortOptions.CREATED_AT_ASC}
      />
    )

    expect(screen.queryByTestId('chevron-down')).toBeNull()
  })
})
