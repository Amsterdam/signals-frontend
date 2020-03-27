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
    const { getByTestId } = render(<MapEditor mapOptions={MAP_OPTIONS} location={testLocation}/>);

    // Map
    expect(getByTestId('map-editor')).toBeInTheDocument();
  });

});
