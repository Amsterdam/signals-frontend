import React from 'react';
import PropTypes from 'prop-types';
import { createLeafletComponent } from '@amsterdam/react-maps';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import 'leaflet';
import 'leaflet.markercluster';

const MarkerClusterGroup = createLeafletComponent('markerClusterGroup');

const MarkerCluster = ({ clusterOptions, setInstance }) => <MarkerClusterGroup setInstance={setInstance} options={clusterOptions} />;

MarkerCluster.propTypes = {
  /**
   * Marker cluster options object
   * @see https://github.com/Leaflet/Leaflet.markercluster#options
   */
  clusterOptions: PropTypes.shape({}),
  setInstance: PropTypes.func,
};

export default MarkerCluster;
