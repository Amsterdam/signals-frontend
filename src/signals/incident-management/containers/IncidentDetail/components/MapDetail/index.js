import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import { locationType } from 'shared/types';
import './style.scss';

const MapDetail = ({ value, mapOptions, ...otherProps }) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  const latlng = location ? { latitude: location[1], longitude: location[0] } : null;
  const options = {
    ...mapOptions,
    center: location.reverse(),
  };

  return (
    <div className="map-detail">
      {latlng && (
        <Map latlng={latlng} mapOptions={options} {...otherProps} />
      ) }
    </div>
  );
};

MapDetail.propTypes = {
  value: locationType.isRequired,
  mapOptions: PropTypes.shape({}).isRequired, /** leaflet options */
};

export default MapDetail;
