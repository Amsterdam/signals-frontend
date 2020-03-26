import React from 'react';
import { render } from '@testing-library/react';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MapEditor from "..";

describe('components/MapEditor', () => {
  const testLocation = {
    geometrie: {
      type: 'Point',
      coordinates: [4, 52],
    },
  };

  it('should render the map', () => {
    const { getByTestId } = render(<MapEditor mapOptions={MAP_OPTIONS} location={{}}/>);

    // Map
    expect(getByTestId('map')).toBeInTheDocument();
  });

  it('should render the marker', () => {
    const { container, rerender } = render(<MapEditor mapOptions={MAP_OPTIONS} location={{}}/>);

    expect(container.querySelector('.sia-map-marker')).not.toBeInTheDocument();

    rerender(<MapEditor mapOptions={MAP_OPTIONS} location={testLocation} hasZoom/>);
    expect(container.querySelector('.sia-map-marker')).toBeInTheDocument();
  });
});
