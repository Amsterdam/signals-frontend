// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import configuration from 'shared/services/configuration/configuration'

import MapPreview from '.'

jest.mock('shared/services/configuration/configuration')

jest.mock('components/MapStatic', () => (props) => (
  <span data-testid="mapStatic" {...props} />
))

describe('signals/incident/components/IncidentPreview/components/MapPreview', () => {
  const coordinates = {
    lat: 52,
    lng: 4,
  }

  afterEach(() => {
    configuration.__reset()
  })

  it('should render normal map with useStaticMapServer disabled', () => {
    render(withAppContext(<MapPreview value={{ coordinates }} />))

    expect(screen.getByText('Locatie gepind op de kaart')).toBeInTheDocument()
    expect(screen.queryByTestId('mapStatic')).not.toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).toBeInTheDocument()
  })

  it('should render static map with useStaticMapServer enabled', () => {
    configuration.featureFlags.useStaticMapServer = true

    render(withAppContext(<MapPreview value={{ coordinates }} />))

    expect(screen.queryByTestId('mapStatic')).toBeInTheDocument()
    expect(screen.queryByTestId('map-base')).not.toBeInTheDocument()
  })
})
