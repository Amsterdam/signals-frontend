import React from 'react';
import { render } from '@testing-library/react';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Map from '..';

describe('components/Map', () => {

  it('should render the map', () => {
    const { getByTestId, queryByText } = render(<Map mapOptions={MAP_OPTIONS} />);

    // Map
    expect(getByTestId('map-test-id')).toBeInTheDocument();

    // Tile layer
    expect(queryByText(/Kaartgegevens CC-BY-4.0 Gemeente Amsterdam/)).toBeInTheDocument();
  });

  it('should render the zoom control', () => {
    const { container, rerender } = render(<Map mapOptions={MAP_OPTIONS} lat={42} lng={4}/>);

    expect(container.querySelector('button[title="Inzoomen"]')).not.toBeInTheDocument();

    rerender(<Map mapOptions={MAP_OPTIONS} hasZoomControls />);
    expect(container.querySelector('button[title="Inzoomen"]')).toBeInTheDocument();
  });

  it('should render the marker', () => {
    const { container, rerender } = render(<Map mapOptions={MAP_OPTIONS}/>);

    expect(container.querySelector('.sia-map-marker')).not.toBeInTheDocument();

    rerender(<Map mapOptions={MAP_OPTIONS} lat={42}  />);
    expect(container.querySelector('.sia-map-marker')).not.toBeInTheDocument();

    rerender(<Map mapOptions={MAP_OPTIONS} lng={4} />);
    expect(container.querySelector('.sia-map-marker')).not.toBeInTheDocument();

    rerender(<Map mapOptions={MAP_OPTIONS} lat={42} lng={4} />);
    expect(container.querySelector('.sia-map-marker')).toBeInTheDocument();

  });
});
