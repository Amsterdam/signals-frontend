// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ThemeProvider } from '@amsterdam/asc-ui'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { history, withAppContext } from 'test/utils'

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
  describe('Realtime dashboard', () => {
    it('should render correctly', async () => {
      render(renderWithContext())

      await waitFor(() => {
        history.push('/manage/dashboard')
      })

      expect(screen.getByText('[Filter]')).toBeInTheDocument()
      expect(screen.getByText('[BarChart]')).toBeInTheDocument()
      expect(screen.getByText('[AreaChart]')).toBeInTheDocument()
    })
  })

  it('should render subpages by clicking tabs', async () => {
    render(renderWithContext())

    await waitFor(() => {
      history.push('/manage/dashboard')
    })

    expect(history.location.pathname).toBe('/manage/dashboard/nu')

    userEvent.click(
      screen.getByRole('tab', {
        name: 'Signalering',
      })
    )

    expect(history.location.pathname).toBe('/manage/dashboard/signalering')

    userEvent.click(
      screen.getByRole('tab', {
        name: 'Nu',
      })
    )

    expect(history.location.pathname).toBe('/manage/dashboard/nu')
  })
})
