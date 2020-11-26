import React from 'react';
import { render, screen } from '@testing-library/react';

import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';

import MapSelect, { getLatlng, DEFAULT_COORDS } from '.';

describe('signals/incident/components/IncidentPreview/components/MapSelect', () => {
  it('renders correctly', () => {
    const value = ['foo', 'bar', 'baz'];

    render(
      withAppContext(
        <MapSelect value={value} endpoint={configuration.map.layers.verlichting} incident={incidentFixture} />
      )
    );

    expect(screen.getByText(value.join('; '))).toBeInTheDocument();
    expect(screen.getByTestId('mapSelect')).toBeInTheDocument();
  });

  it('returns a location', () => {
    expect(getLatlng(incidentFixture.location)).toEqual({
      latitude: incidentFixture.location.geometrie.coordinates[1],
      longitude: incidentFixture.location.geometrie.coordinates[0],
    });
  });

  it('returns default coords', () => {
    expect(getLatlng()).toEqual({
      latitude: DEFAULT_COORDS[1],
      longitude: DEFAULT_COORDS[0],
    });
  });
});
