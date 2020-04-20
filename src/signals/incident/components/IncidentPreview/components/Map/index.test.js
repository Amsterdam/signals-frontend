import React from 'react';
import { render } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import MapPreview from './index';

describe('signals/incident/components/IncidentPreview/components/Map', () => {
  const address = {
    openbare_ruimte: 'Hell',
    huisnummer: '666',
    huisletter: 'C',
    postcode: '1087JC',
    woonplaats: 'Amsterdam',
  };

  const geometrie = {
    coordinates: [52, 4],
  };

  const value = {
    address,
    geometrie,
  };

  const label = 'Location';

  it('should render label', async () => {
    const { getByText, findByTestId } = render(withAppContext(<MapPreview label={label} value={value} />));

    await findByTestId('mapPreview');

    expect(getByText(label)).toBeInTheDocument();
  });

  it('should show address fallback', async () => {
    const { getByText, findByTestId } = render(withAppContext(<MapPreview label={label} value={{ geometrie }} />));

    await findByTestId('mapPreview');

    expect(getByText('Geen adres gevonden')).toBeInTheDocument();
  });

  it('should render static map', async () => {
    const { findByTestId, getByTestId } = render(withAppContext(<MapPreview label={label} value={{ geometrie }} />));

    await findByTestId('mapPreview');

    expect(getByTestId('mapStatic')).toBeInTheDocument();
  });
});
