import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import { locationType } from 'shared/types';
import './style.scss';

const MapDetail = ({ value, mapOptions, ...otherProps }) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  const lat = location && location[1];
  const lng = location && location[0];
  const options = {
    ...mapOptions,
    center: [lat, lng],
  };

  return location ? <Map lat={lat} lng={lng} mapOptions={options} {...otherProps} /> : null;
};

MapDetail.propTypes = {
  value: locationType.isRequired,
  mapOptions: PropTypes.shape({}).isRequired /** leaflet options */,
};

export default MapDetail;
