// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { Filter } from './Filter'
import type { Props } from './Filter'

const mockDefaultProps: Props = {
  currentActiveFilter: null,
  currentStatusFilter: null,
  setActiveFilter: jest.fn(),
  setStatusFilter: jest.fn(),
}

describe('Filter', () => {
  it('should render correctly', () => {
    render(<Filter {...mockDefaultProps} />)

    expect(
      screen.getByRole('radio', { name: 'Alle statussen' })
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Gemeld' })).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: 'In behandeling' })
    ).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Alle' })).toBeInTheDocument()
    expect(
      screen.getByRole('radio', { name: 'Non-actief' })
    ).toBeInTheDocument()
  })
})
