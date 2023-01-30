// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { ComparisonRate } from './ComparisonRate'

describe('ComparisonRate', () => {
  it('should render correct with positive value', () => {
    render(<ComparisonRate percentage={12} />)

    const percentage = screen.getByText('12%')
    const description = screen.getByText('vs vorige week')
    const icon = screen.getByRole('img')

    expect(percentage).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(icon).toHaveAttribute('src', '/assets/images/dashboard/arrow-up.svg')
  })

  it('should render correct with negative value', () => {
    render(<ComparisonRate percentage={-10} />)

    const percentage = screen.getByText('-10%')
    const icon = screen.getByRole('img')

    expect(percentage).toBeInTheDocument()
    expect(icon).toHaveAttribute(
      'src',
      '/assets/images/dashboard/arrow-down.svg'
    )
  })
})
