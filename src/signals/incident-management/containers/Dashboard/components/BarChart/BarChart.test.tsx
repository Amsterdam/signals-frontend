// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { BarChart } from './BarChart'

describe('BarChart', () => {
  it('should render correctly', () => {
    render(<BarChart />)

    const title = screen.getByRole('heading', {
      name: 'Openstaande meldingen tot en met vandaag 422',
    })

    expect(title).toBeInTheDocument()
  })
})
