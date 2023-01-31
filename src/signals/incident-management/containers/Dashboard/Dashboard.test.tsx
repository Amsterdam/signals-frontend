// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { ThemeProvider } from '@amsterdam/asc-ui'
import { render } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import Dashboard from './Dashboard'

window.HTMLElement.prototype.scrollIntoView = jest.fn()

const renderWithContext = () =>
  withAppContext(
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )

describe('signals/incident-management/containers/Dashboard', () => {
  it('should render correctly', () => {
    render(renderWithContext())
  })
})
