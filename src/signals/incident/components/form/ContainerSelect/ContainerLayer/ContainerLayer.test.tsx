import type { ReactNode } from 'react';
import React from 'react';

import type { FeatureCollection } from 'geojson';
import type { MapOptions } from 'leaflet';

import { render, screen } from '@testing-library/react';

import { Map } from '@amsterdam/react-maps';

import containersJson from 'utils/__tests__/fixtures/containers.json';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import ContainerLayer from '.';
import type { FeatureType } from '../types';
import { WfsDataProvider } from '../WfsLayer/context';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const options: MapOptions = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362],
  zoom: 14,
};

const withMapContainer = (Component: ReactNode) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
);

describe('src/signals/incident/components/form/ContainerSelect/Selector/MarkerCluster', () => {
  const featureTypes: FeatureType[] = [
    {
      label: 'Restafval',
      description: 'Restafval container',
      icon: {
        options: {},
        iconSvg: 'iconSvg',
        selectedIconSvg: 'selectedIconSvg',
      },
      idField: 'id_nummer',
      typeField: 'fractie_omschrijving',
      typeValue: 'Rest',
    },
    {
      label: 'Papier',
      description: 'Papier container',
      icon: {
        options: {},
        iconSvg: 'iconSvg',
        selectedIconSvg: 'selectedIconSvg',
      },
      idField: 'id_nummer',
      typeField: 'fractie_omschrijving',
      typeValue: 'Papier',
    },
  ];

  it('should render the cluster layer in the map', () => {
    const ContainerLayerWrapper = () => (
      <WfsDataProvider value={containersJson as FeatureCollection}>
        <ContainerLayer featureTypes={featureTypes} />;
      </WfsDataProvider>
    );
    render(withMapContainer(<ContainerLayerWrapper />));

    expect(screen.getByTestId('map-test')).toBeInTheDocument();
  });
});
