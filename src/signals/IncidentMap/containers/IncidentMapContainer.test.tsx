// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withPortal } from '../components/__test__'
import { IncidentMapContainer } from './IncidentMapContainer'

describe('signals/IncidentMap/IncidentMapContainer', () => {
  it('should render correctly', async () => {
    render(withPortal(<IncidentMapContainer />))

    expect(screen.getByText('Meldingenkaart')).toBeInTheDocument()
    expect(await screen.findByTestId('incidentMap')).toBeInTheDocument()
  })
})
