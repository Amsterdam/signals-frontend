// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import Header from '../Header'

describe('Header', () => {
  it('renders correctly', () => {
    render(
      withAppContext(
        <Header id="foo" count={911} email="example@amsterdam.nl" />
      )
    )

    expect(
      screen.getByRole('heading', {
        name: 'Meldingen van example@amsterdam.nl (911)',
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Terug naar melding' })
    ).toBeInTheDocument()
  })
})
