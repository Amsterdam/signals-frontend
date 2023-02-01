// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { AreaChart } from './AreaChart'

describe('AreaChart', () => {
  it('should render correctly', () => {
    render(<AreaChart />)

    const title = screen.getByRole('heading', {
      name: 'Afgehandelde meldingen afgelopen 7 dagen',
    })

    expect(title).toBeInTheDocument()
  })
})
