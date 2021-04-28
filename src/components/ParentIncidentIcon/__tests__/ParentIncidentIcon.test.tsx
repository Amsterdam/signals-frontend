// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'

import ParentIncidentIcon from '../ParentIncidentIcon'

describe('ParentIncidentIcon', () => {
  it('renders', () => {
    render(<ParentIncidentIcon />)

    expect(
      screen.getByRole('img', { name: 'Hoofdmelding' })
    ).toBeInTheDocument()
  })
})
