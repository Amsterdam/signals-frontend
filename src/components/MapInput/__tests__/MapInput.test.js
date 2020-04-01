import React from 'react';
import { render } from '@testing-library/react';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MapInput from "..";

describe('components/MapInput', () => {
  const testLocation = {
    geometrie: {
      type: 'Point',
      coordinates: [4, 52],
    },
  };

  it('should render the map', () => {
    const { getByTestId } = render(<MapInput mapOptions={MAP_OPTIONS} value={testLocation}/>);

    // Map
    expect(getByTestId('map-input')).toBeInTheDocument();
  });

});
