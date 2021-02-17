import type { Dispatch, FC, SetStateAction } from 'react';
import React from 'react';
import { createLeafletComponent } from '@amsterdam/react-maps';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import 'leaflet';
import 'leaflet.markercluster';

const MarkerClusterGroup = createLeafletComponent('markerClusterGroup');

interface MarkerClusterProps {
  clusterOptions: Record<string, unknown>;
  setInstance: Dispatch<SetStateAction<unknown>>;
}

const MarkerCluster: FC<MarkerClusterProps> = ({ clusterOptions, setInstance }) =>
  <MarkerClusterGroup setInstance={setInstance} options={clusterOptions} /> || null;

export default MarkerCluster;
