import React from 'react';
import { render, screen } from '@testing-library/react';

import incidentFixture from 'utils/__tests__/fixtures/incident.json';
import configuration from 'shared/services/configuration/configuration';
import { withAppContext } from 'test/utils';

jest.mock('shared/services/configuration/configuration');

describe('signals/incident/components/IncidentPreview/components/MapSelect', () => {
  afterEach(() => {
    configuration.__reset();
  });

  it('renders correctly', () => {
    jest.isolateModules(() => {
      const MapSelect = require('.').default;
      const value = ['foo', 'bar', 'baz'];

      render(
        withAppContext(
          <MapSelect
            value={value}
            meta={{ endpoint: configuration.map.layers.verlichting, idField: '' }}
            incident={incidentFixture}
          />
        )
      );

      expect(screen.getByText(value.join('; '))).toBeInTheDocument();
      expect(screen.getByTestId('mapSelect')).toBeInTheDocument();
    });
  });

  it('should render MapSelectGeneric with feature flag enabled', () => {
    jest.isolateModules(() => {
      configuration.featureFlags.useMapSelectGeneric = true;
      const MapSelect = require('.').default;
      const value = ['foo', 'bar', 'baz'];

      render(
        withAppContext(
          <MapSelect
            value={value}
            meta={{ endpoint: configuration.map.layers.verlichting, idField: '' }}
            incident={incidentFixture}
          />
        )
      );

      expect(screen.getByTestId('mapSelectGeneric')).toBeInTheDocument();
    });
  });

  it('returns a location', () => {
    jest.isolateModules(() => {
      const getLatlng = require('.').getLatlng;
      expect(getLatlng(incidentFixture.location)).toEqual({
        latitude: incidentFixture.location.geometrie.coordinates[1],
        longitude: incidentFixture.location.geometrie.coordinates[0],
      });
    });
  });

  it('returns default coords', () => {
    jest.isolateModules(() => {
      const getLatlng = require('.').getLatlng;
      const DEFAULT_COORDS = require('.').DEFAULT_COORDS;
      expect(getLatlng()).toEqual({
        latitude: DEFAULT_COORDS[1],
        longitude: DEFAULT_COORDS[0],
      });
    });
  });
});
