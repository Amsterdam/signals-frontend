// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'

import MaintenancePage from './MaintenancePage'

describe('MaintenancePage', () => {
  it('should render MaintenancePage', () => {
    render(withAppContext(<MaintenancePage />))

    expect(
      screen.getByText('Melding openbare ruimte en overlast')
    ).toBeInTheDocument()
    expect(screen.getByText('Tijdelijk niet te gebruiken')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Wij zijn dit formulier aan het verbeteren. Daarom kunt u het formulier korte tijd niet gebruiken. Probeer het later nog eens.'
      )
    ).toBeInTheDocument()
  })
})
