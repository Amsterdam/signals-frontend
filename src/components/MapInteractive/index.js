/* eslint-disable react/no-did-mount-set-state */

import React from 'react';
import { Map, TileLayer } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import crs from './crs';
import GPSButton from './GPSButton';

const DEFAULT_ZOOM_LEVEL = 12;

const MapInteractive = ({ center }) => {
  return (
    <Map
      events={{
        locationfound: ({ latitude, longitude, target }) => {
          target.panTo([latitude, longitude]);
        },
      }}
      options={{
        center,
        zoom: DEFAULT_ZOOM_LEVEL,
        crs,
        maxBounds: [
          [52.25168, 4.64034],
          [52.50536, 5.10737],
        ],
        minZoom: 8,
        maxZoom: 14,
        dragging: !global.L.Browser.touch,
        tap: false,
        scrollWheelZoom: false,
      }}
      style={{
        width: '100%',
        height: '450px',
      }}
    >
      <ViewerContainer topRight={<GPSButton />} />

      <TileLayer
        args={['https://t{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
        options={{
          subdomains: '1234',
          tms: true,
          detectRetina: true,
        }}
      />
    </Map>
  );
};

MapInteractive.defaultProps = {
  center: [52.3731081, 4.8932945],
};

export default MapInteractive;
