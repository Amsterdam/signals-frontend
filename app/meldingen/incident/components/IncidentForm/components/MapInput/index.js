/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import ErrorMessage from '../ErrorMessage/';

const MapInput = ({ handler, touched, hasError, meta }) => {
  let location;
  let latlng;

  const onMapAction = (l, ll) => {
    console.log('onMapAction', l, ll);
  };

  return (
    <div className="row">
      <div className="col-12">
        <Map onLocationChange={onMapAction} location={location} latlng={latlng} />
      </div>

      <div className="col-12">
        <ErrorMessage
          touched={touched}
          hasError={hasError}
        />
      </div>
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
