import type { ReactNode } from 'react';
import React from 'react';
import type { LatLngTuple } from 'leaflet';
import { Map } from '@amsterdam/react-maps';

import { render, screen } from '@testing-library/react';
import MAP_OPTIONS from 'shared/services/configuration/map-options';

import * as useLayerVisible from '../../useLayerVisible';
import ZoomMessage from '..';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const options = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362] as LatLngTuple,
  zoom: 14,
};

const withMapContainer = (Component: ReactNode) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
);

describe('ZoomMessage', () => {
  const props = { zoomLevel: { max: 12 } };

  it('should render the message in the map', () => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => false);
    render(withMapContainer(<ZoomMessage {...props} />));


    expect(screen.getByTestId('zoomMessage')).toBeInTheDocument();
  });

  it('should NOT render the message in the map', () => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => true);
    render(withMapContainer(<ZoomMessage {...props} />));

    expect(screen.queryByTestId('zoomMessage')).not.toBeInTheDocument();
  });
});
