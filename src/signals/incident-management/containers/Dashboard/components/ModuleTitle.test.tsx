// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { ModuleTitle } from './ModuleTitle'

describe('ModuleTitle', () => {
  it('should render correctly', () => {
    render(<ModuleTitle title="Afgehandelde meldingen" />)

    const title = screen.getByRole('heading', {
      name: 'Afgehandelde meldingen',
    })

    expect(title).toBeInTheDocument()
  })

  it('should render with subtitle', () => {
    render(
      <ModuleTitle
        title="Afgehandelde meldingen"
        subtitle="Verloop van de week"
      />
    )

    const subtitle = screen.getByText('Verloop van de week')

    expect(subtitle).toBeInTheDocument()
  })

  it('should render with amount', () => {
    render(
      <ModuleTitle
        title="Afgehandelde meldingen"
        subtitle="Verloop van de week"
        amount={422}
      />
    )

    const title = screen.getByRole('heading', {
      name: 'Afgehandelde meldingen 422',
    })

    expect(title).toBeInTheDocument()
  })
})
