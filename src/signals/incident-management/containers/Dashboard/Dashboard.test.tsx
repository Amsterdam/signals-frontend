// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import Dashboard from './Dashboard'
import { withAppContext } from 'test/utils'
import { ThemeProvider } from '@amsterdam/asc-ui'

const renderWithContext = () =>
  withAppContext(
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
describe('signals/incident-management/containers/Dashboard', () => {
  it('should render correctly', () => {
    render(renderWithContext())
    expect(screen.getByText('menu')).toBeInTheDocument()
  })
})
