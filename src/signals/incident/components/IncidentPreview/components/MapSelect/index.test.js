// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import { render, screen } from '@testing-library/react'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import { withAppContext } from 'test/utils'

jest.mock('shared/services/configuration/configuration')

describe('signals/incident/components/IncidentPreview/components/MapSelect/index.js', () => {
  it('should render MapSelectGeneric with feature flag enabled', () => {
    configuration.featureFlags.useMapSelectGeneric = true
    const MapSelect = require('./index.js').default
    const value = ['foo', 'bar', 'baz']

    render(
      withAppContext(
        <MapSelect
          value={value}
          meta={{ endpoint: 'https://endpoint', idField: '' }}
          incident={incidentFixture}
        />
      )
    )

    expect(screen.getByTestId('mapSelectGeneric')).toBeInTheDocument()
  })
})
