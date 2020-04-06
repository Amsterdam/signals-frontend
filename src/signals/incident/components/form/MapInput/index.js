import React from 'react';
import PropTypes from 'prop-types';

import MapInputComponent from 'components/MapInput';
import MapContext from 'containers/MapContext';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import mapLocation, { formatMapLocation } from 'shared/services/map-location';
import Header from '../Header';


const MapInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const value = formatMapLocation(handler().value || {});
  const { lat, lng } = value?.location || {};
  const mapOptions = {
    ...MAP_OPTIONS,
    center: (lat && lng) ? [lat, lng] : [...MAP_OPTIONS.center],
  };

  /* istanbul ignore next */
  const onLocationChange = d => {
    parent.meta.updateIncident({ location: mapLocation(d) });
  };

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ? (
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
            <div className="invoer">
              <MapContext>
                <MapInputComponent onChange={onLocationChange} value={value} mapOptions={mapOptions} />
              </MapContext>
            </div>
          </Header>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

MapInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default MapInput;
