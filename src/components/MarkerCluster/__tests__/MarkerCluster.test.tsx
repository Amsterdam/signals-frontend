// SPDX-License-Identifier: MPL-2.0
// Copyright (C)  - 2021 Gemeente Amsterdam
// eslint-disable-next-line import/no-duplicates
import type L from 'leaflet';
// eslint-disable-next-line import/no-duplicates
import type { MapOptions } from 'leaflet';
import React from 'react';
import { render } from '@testing-library/react';

import { Map } from '@amsterdam/react-maps';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MarkerCluster from '..';

const options = {
  ...MAP_OPTIONS,
  maxZoom: 18,
} as MapOptions;
const withMapContainer = (Component: JSX.Element) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
);

describe('signals/incident-management/containes/IncidentOverviewPage/components/MarkerCluster', () => {
  it('should render the cluster layer in the map', () => {
    const setInstanceMock = jest.fn();
    const { getByTestId } = render(
      withMapContainer(
        <MarkerCluster clusterOptions={{ test: 1 } as L.MarkerClusterGroupOptions} setInstance={setInstanceMock} />
      )
    );

    expect(getByTestId('map-test')).toBeInTheDocument();
    expect(setInstanceMock).toHaveBeenCalledTimes(1);
  });
});
