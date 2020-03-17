import React from 'react';
import { TileLayer } from '@datapunt/react-maps';

const BackgroundLayer = () => (
  <TileLayer
    args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
    options={{
      subdomains: ['t1', 't2', 't3', 't4'],
      tms: true,
      attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
    }}
  />
);

export default BackgroundLayer;
