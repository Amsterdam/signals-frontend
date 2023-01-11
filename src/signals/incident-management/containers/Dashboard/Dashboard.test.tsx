// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import Dashboard from './Dashboard'

// jest.mock('shared/services/configuration/configuration')
describe('signals/incident-management/containers/Dashboard', () => {
  it('should render correctly', () => {
    render(<Dashboard />)
    // screen.debug()
    // expect(screen.getByText('menu')).toBeInTheDocument()

    // configuration.featureFlags.showRealTimeDashboard = false
    // rerender(<Dashboard />)
    // expect(screen.queryByText('menu')).not.toBeInTheDocument()
  })
})
