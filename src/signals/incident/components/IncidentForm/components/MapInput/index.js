/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from '../../../../../../containers/MapContainer';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const MapInput = ({ handler, touched, hasError, meta, parent }) => {
  const value = handler().value;
  let address;
  let latlng;

  if (value) {
    latlng = {
      lat: value.lat,
      lng: value.lng
    };

    address = value.address;
  }

  const onMapAction = (l, ll) => {
    parent.meta.setIncident({
      location: {
        lat: ll.lat,
        lng: ll.lng,
        address: l
      }
    });
    latlng = ll;
  };

  return (
    <div>
      {meta.ifVisible ?
        <div className="row">
          <Title meta={meta} />

          <div className={`col-${meta.cols || 12} invoer`}>
            <MapContainer onLocationChange={onMapAction} location={address} latlng={latlng} />
          </div>

          <div className="col-12">
            <ErrorMessage
              touched={touched}
              hasError={hasError}
            />
          </div>
        </div>
         : ''}
    </div>
  );
};

MapInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object
};

export default MapInput;
