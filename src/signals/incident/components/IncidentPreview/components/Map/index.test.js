import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import MapPreview from '.';

describe('signals/incident/components/IncidentPreview/components/Map', () => {
  const geometrie = {
    coordinates: [52, 4],
  };

  it('should show address fallback', async () => {
    const { getByText, findByTestId } = render(withAppContext(<MapPreview value={{ geometrie }} />));

    await findByTestId('mapStatic');

    expect(getByText('Geen adres gevonden')).toBeInTheDocument();
  });

  it('should render static map', async () => {
    const { findByTestId } = render(withAppContext(<MapPreview value={{ geometrie }} />));

    const mapStatic = await findByTestId('mapStatic');

    expect(mapStatic).toBeInTheDocument();
  });
});
