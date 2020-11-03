import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';
import configuration from 'shared/services/configuration/configuration';

import MapPreview from '.';

jest.mock('shared/services/configuration/configuration');

describe('signals/incident/components/IncidentPreview/components/Map', () => {
  const geometrie = {
    coordinates: [52, 4],
  };

  afterEach(() => {
    configuration.__reset();
  });

  it('should show address fallback', async () => {
    const { getByText, findByTestId } = render(withAppContext(<MapPreview value={{ geometrie }} />));

    await findByTestId('mapStatic');

    expect(getByText('Geen adres gevonden')).toBeInTheDocument();
  });

  it('should render static map with useStaticMapServer enabled', async () => {
    const { findByTestId, queryByTestId } = render(withAppContext(<MapPreview value={{ geometrie }} />));

    await findByTestId('mapStatic');

    expect(queryByTestId('mapStatic')).toBeInTheDocument();
    expect(queryByTestId('map-base')).not.toBeInTheDocument();
  });

  it('should render normal map with useStaticMapServer disabled', () => {
    configuration.featureFlags.useStaticMapServer = false;

    const { queryByTestId } = render(withAppContext(<MapPreview value={{ geometrie }} />));

    expect(queryByTestId('mapStatic')).not.toBeInTheDocument();
    expect(queryByTestId('map-base')).toBeInTheDocument();
  });
});
