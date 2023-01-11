// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import Dashboard from './Dashboard'

describe('<Dashboard />', () => {
  it('should render error notification', async () => {
    const { rerender } = render(<Dashboard />)

    expect(
      screen.getByText('Er is iets misgegaan met het data ophalen.')
    ).not.toBeInTheDocument()

    rerender(render(<Dashboard />))
  })
})
