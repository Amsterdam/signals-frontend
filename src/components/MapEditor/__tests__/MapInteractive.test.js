import React from 'react';
import { render } from '@testing-library/react';

import Map from '..';
import MAP_OPTIONS from '../../../shared/services/configuration/map-options';

describe('components/MapInteractive', () => {
  const testLocation = {
    geometrie: {
      type: 'Point',
      coordinates: [4, 52],
    },
  };

  it('should render the map', () => {
    const { container, getByText } = render(<Map options={MAP_OPTIONS} location={{}}/>);

    // Map
    expect(getByText('Leaflet')).toBeInTheDocument();

    // Tile layer
    expect(container.querySelector('.leaflet-tile-container')).toBeInTheDocument();

    // Zoom
    expect(container.querySelector('button[title="Inzoomen"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Uitzoomen"]')).toBeInTheDocument();
  });

  it('should render the marker', () => {
    const { container, rerender } = render(<Map options={MAP_OPTIONS} location={{}}/>);

    expect(container.querySelector('img.leaflet-marker-icon')).not.toBeInTheDocument();

    rerender(<Map options={MAP_OPTIONS} location={testLocation} />);
    expect(container.querySelector('img.leaflet-marker-icon')).toBeInTheDocument();
  });
});
