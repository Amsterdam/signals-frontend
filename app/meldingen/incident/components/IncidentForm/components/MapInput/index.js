import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import ErrorMessage from '../ErrorMessage/';

/* eslint-disable no-unused-vars */
const MapInput = ({ handler, touched, hasError, meta }) => {
  let location;
  let latlng;

  const onMapAction = (l, ll) => {
    location = l;
    latlng = ll;
  };

  return (
    <div>
      <Map onLocationChange={onMapAction} location={location} latlng={latlng} />

      <ErrorMessage
        touched={touched}
        hasError={hasError}
      />
    </div>
  );
};

MapInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object
};

export default MapInput;
