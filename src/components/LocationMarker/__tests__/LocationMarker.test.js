import L from 'leaflet';
import React from 'react';
import { render} from '@testing-library/react';
import { withAppContext } from 'test/utils';

import MAP_OPTIONS from 'shared/services/configuration/map-options';

import Map from '../../Map';
import LocationMarker from '..';

jest.mock('leaflet', () => jest.requireActual('leaflet'));

L.Circle.prototype.addTo = jest.fn();
L.Circle.prototype.setLatLng = jest.fn();
L.Circle.prototype.setRadius = jest.fn();

L.CircleMarker.prototype.addTo = jest.fn();
L.CircleMarker.prototype.setLatLng = jest.fn();
L.CircleMarker.prototype.setRadius = jest.fn();

describe('components/LocationMarker', () => {
  it('creates vector layers', () => {
    const accuracy = 1234;
    const latitude = 52;
    const longitude = 4;
    const geolocation = {
      accuracy,
      latitude,
      longitude,
    };

    expect(L.Circle.prototype.addTo).not.toHaveBeenCalled();
    expect(L.Circle.prototype.setLatLng).not.toHaveBeenCalled();
    expect(L.Circle.prototype.setRadius).not.toHaveBeenCalled();

    expect(L.CircleMarker.prototype.addTo).not.toHaveBeenCalled();
    expect(L.CircleMarker.prototype.setLatLng).not.toHaveBeenCalled();

    render(
      withAppContext(
        <Map mapOptions={MAP_OPTIONS}>
          <LocationMarker geolocation={geolocation} />
        </Map>
      )
    );

    expect(L.Circle.prototype.addTo).toHaveBeenCalled();
    expect(L.Circle.prototype.setLatLng).toHaveBeenCalledWith([latitude, longitude]);
    expect(L.Circle.prototype.setRadius).toHaveBeenCalledWith(accuracy);

    expect(L.CircleMarker.prototype.addTo).toHaveBeenCalled();
    expect(L.CircleMarker.prototype.setLatLng).toHaveBeenCalledWith([latitude, longitude]);
  });
});
