// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { ComparisonRate, Direction } from './ComparisonRate'

describe('ComparisonRate', () => {
  it('should render correct with positive value', () => {
    const mockComparisonRate = {
      direction: Direction.UP,
      percentage: 12,
    }

    render(<ComparisonRate comparisonRate={mockComparisonRate} />)

    const percentage = screen.getByText('12%')
    const description = screen.getByText('vs vorige week')
    const icon = screen.getByRole('img')

    expect(percentage).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(icon).toHaveAttribute('src', '/assets/images/dashboard/arrow-up.svg')
  })

  it('should render correct with negative value', () => {
    const mockComparisonRate = {
      direction: Direction.DOWN,
      percentage: 10,
    }

    render(<ComparisonRate comparisonRate={mockComparisonRate} />)

    const percentage = screen.getByText('-10%')
    const icon = screen.getByRole('img')

    expect(percentage).toBeInTheDocument()
    expect(icon).toHaveAttribute(
      'src',
      '/assets/images/dashboard/arrow-down.svg'
    )
  })
})
