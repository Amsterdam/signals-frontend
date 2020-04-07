import React from 'react';
import { render } from '@testing-library/react';
import MapContext from 'containers/MapContext';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MapInput from '..';

const withMapContext = Component => <MapContext>{Component}</MapContext>;

describe('components/MapInput', () => {
  const testLocation = {
    geometrie: {
      type: 'Point',
      coordinates: [4, 52],
    },
  };

  it('should render the map and the autosuggest', () => {
    const { getByTestId } = render(withMapContext(<MapInput mapOptions={MAP_OPTIONS} value={testLocation} />));

    // Map
    expect(getByTestId('map-input')).toBeInTheDocument();
    expect(getByTestId('autoSuggest')).toBeInTheDocument();
  });

  it.only('should fill in the provided location/address value', () => {
    const location = {
      lat: 52.36058599633851,
      lng: 4.894292258032637,
    };
    const value = {
      location,
      addressText: 'Nieuwe Looiersstr 47, 1017VB Amsterdam',
      address: {
        postcode: '1017VB',
        huisletter: '',
        huisnummer: '47',
        woonplaats: 'Amsterdam',
        openbare_ruimte: 'Nieuwe Looiersstr',
        huisnummertoevoeging: '',
      },
    };
    const mapOptions = {
      ...MAP_OPTIONS,
      center: [location.lat, location.lng],
    };

    const { container, getByTestId, debug } = render(
      withMapContext(<MapInput mapOptions={mapOptions} value={value} />)
    );
    debug();

    const inputElement = getByTestId('autoSuggest').querySelector('input');
    expect(inputElement.value).toEqual(value.addressText);

    // Marker
    expect(container.querySelector('.sia-map-marker')).toBeInTheDocument();
  });
});
