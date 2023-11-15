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
        ordering={SortOptions.CREATED_AT_DESC}
      />
    )

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
  })

  it('should render a sort icon for created at desc when its asc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.CREATED_AT_DESC}
        ordering={SortOptions.CREATED_AT_ASC}
      />
    )

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
  })

  // and now for address
  it('should render a sort icon for address asc when its desc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ADDRESS_ASC}
        ordering={SortOptions.ADDRESS_DESC}
      />
    )

    expect(screen.getByTestId('chevron-up')).toBeInTheDocument()
  })

  it('should render a sort icon for address desc when its asc', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ADDRESS_DESC}
        ordering={SortOptions.ADDRESS_ASC}
      />
    )

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument()
  })

  it('should return null when there is no match between sortOption and ordering', () => {
    render(
      <SortIcon
        sortOption={SortOptions.ADDRESS_ASC}
        ordering={SortOptions.CREATED_AT_ASC}
      />
    )

    expect(screen.queryByTestId('chevron-down')).toBeNull()
  })
})
