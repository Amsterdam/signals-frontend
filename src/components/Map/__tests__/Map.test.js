import React from 'react';
import { render } from '@testing-library/react';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Map from '..';

describe('components/Map', () => {
  it('should render the map', () => {
    const { getByTestId, queryByText } = render(<Map mapOptions={MAP_OPTIONS} />);

    // Map
    expect(getByTestId('map-base')).toBeInTheDocument();

    // Tile layer
    expect(queryByText(/Kaartgegevens CC-BY-4.0 Gemeente Amsterdam/)).toBeInTheDocument();
  });

  it('should render the zoom control', () => {
    const { container, rerender } = render(<Map mapOptions={MAP_OPTIONS} />);

    expect(container.querySelector('button[title="Inzoomen"]')).not.toBeInTheDocument();

    rerender(<Map mapOptions={MAP_OPTIONS} hasZoomControls />);
    expect(container.querySelector('button[title="Inzoomen"]')).toBeInTheDocument();
  });
});
