// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import { StandardTextsAdmin } from './StandardTextsAdmin'

describe('StandardTextsAdmin', () => {
  it('should render correctly', async () => {
    render(withAppContext(<StandardTextsAdmin />))

    await waitFor(() => {
      expect(screen.getByText('Standaardteksten overzicht')).toBeInTheDocument()
    })
  })
})
