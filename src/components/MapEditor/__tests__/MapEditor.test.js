import React from 'react';
import { render } from '@testing-library/react';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Map from '..';

describe('components/MapEditor', () => {
  const testLocation = {
    geometrie: {
      type: 'Point',
      coordinates: [4, 52],
    },
  };

  it('should render the map', () => {
    const { container, getByTestId, queryByText } = render(<Map options={MAP_OPTIONS} location={{}}/>);

    // Map
    expect(getByTestId('map-test-id')).toBeInTheDocument();

    // Tile layer
    expect(queryByText(/Kaartgegevens CC-BY-4.0 Gemeente Amsterdam/)).toBeInTheDocument();

    // Zoom
    expect(container.querySelector('button[title="Inzoomen"]')).toBeInTheDocument();
    expect(container.querySelector('button[title="Uitzoomen"]')).toBeInTheDocument();
  });

  it('should render the marker', () => {
    const { container, rerender } = render(<Map options={MAP_OPTIONS} location={{}}/>);

    expect(container.querySelector('.sia-map-marker')).not.toBeInTheDocument();

    rerender(<Map options={MAP_OPTIONS} location={testLocation} />);
    expect(container.querySelector('.sia-map-marker')).toBeInTheDocument();
  });
});
