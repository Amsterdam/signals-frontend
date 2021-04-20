// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
import React from 'react'
import { render, screen } from '@testing-library/react'

import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import configuration from 'shared/services/configuration/configuration'
import { withAppContext } from 'test/utils'

import MapSelectGeneric, { getLatlng } from '.'

describe('signals/incident/components/IncidentPreview/components/MapSelectGeneric', () => {
  it('renders correctly', () => {
    const value = ['foo', 'bar', 'baz']

    render(
      withAppContext(
        <MapSelectGeneric
          value={value}
          meta={{
            endpoint: 'url',
            idField: 'objectnummer',
          }}
          incident={incidentFixture}
        />
      )
    )

    expect(screen.getByText(value.join('; '))).toBeInTheDocument()
    expect(screen.getByTestId('mapSelectGeneric')).toBeInTheDocument()
  })

  it('returns a location', () => {
    expect(getLatlng(incidentFixture.location)).toEqual({
      latitude: incidentFixture.location.geometrie.coordinates[1],
      longitude: incidentFixture.location.geometrie.coordinates[0],
    })
  })

  it('returns default coords', () => {
    expect(getLatlng()).toEqual({
      latitude: configuration.map.options.center[0],
      longitude: configuration.map.options.center[1],
    })
  })
})
