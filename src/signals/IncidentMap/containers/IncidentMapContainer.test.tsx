// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { IncidentMapContainer } from './IncidentMapContainer'
import { withPortal } from '../components/__test__'

describe('signals/IncidentMap/IncidentMapContainer', () => {
  it('should render correctly', async () => {
    render(withPortal(<IncidentMapContainer />))

    expect(screen.getByText('Meldingenkaart')).toBeInTheDocument()
    expect(await screen.findByTestId('incident-map')).toBeInTheDocument()
  })
})
