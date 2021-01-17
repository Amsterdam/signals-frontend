import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import type { Point } from 'geojson';
import type { GeoJSON as GeoJSONLayer, MapOptions } from 'leaflet';
import L from 'leaflet';

import { render, screen } from '@testing-library/react';

import { Map } from '@amsterdam/react-maps';

import containersJson from 'utils/__tests__/fixtures/containers.json';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import MarkerCluster from './ContainerLayer';
import { featureTolocation } from 'shared/services/map-location';
import { markerIcon } from 'shared/services/configuration/map-markers';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const options: MapOptions = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362],
  zoom: 14,
};

const withMapContainer = (Component: ReactNode) =>
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>;
describe('src/signals/incident/components/form/ContainerSelect/Selector/MarkerCluster', () => {
  it('should render the cluster layer in the map', () => {
    const MarkerClusterWrapper = () => {
      const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();

      useEffect(() => {
        if (layerInstance) {
          layerInstance.clearLayers();
          containersJson.features.forEach(feature => {
            const coordinates = (feature.geometry as Point).coordinates;
            const latlng = featureTolocation({ coordinates });
            const clusteredMarker = L.marker(latlng, { icon: markerIcon });
            layerInstance.addLayer(clusteredMarker);
          });
        }

        return () => {
          if (layerInstance) {
            // This ensures that for each refresh of the data, the click
            // events that are bound in the layer data are removed.
          }
        };
      }, [layerInstance]);
      return <MarkerCluster setLayerInstance={setLayerInstance} />;
    };
    render(withMapContainer(<MarkerClusterWrapper />));

    expect(screen.getByTestId('map-test')).toBeInTheDocument();
    // expect(mockedSetLayerInstance).toHaveBeenCalledTimes(1);
  });
});
