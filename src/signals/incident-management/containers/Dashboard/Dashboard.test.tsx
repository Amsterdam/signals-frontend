// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ThemeProvider } from '@amsterdam/asc-ui'
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Dashboard from './Dashboard'

jest.mock('./components', () => {
  const actual = jest.requireActual('./components')
  return {
    ...actual,
    AreaChart: jest.fn(() => <div>[AreaChart]</div>),
    BarChart: jest.fn(() => <div>[BarChart]</div>),
    Filter: jest.fn(() => <div>[Filter]</div>),
  }
})

window.HTMLElement.prototype.scrollIntoView = jest.fn()

const renderWithContext = () =>
  withAppContext(
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )

describe('Dashboard', () => {
  it('should render correctly', () => {
    render(renderWithContext())

    expect(screen.getByText('[Filter]')).toBeInTheDocument()
    expect(screen.getByText('[BarChart]')).toBeInTheDocument()
    expect(screen.getByText('[AreaChart]')).toBeInTheDocument()
  })
})
