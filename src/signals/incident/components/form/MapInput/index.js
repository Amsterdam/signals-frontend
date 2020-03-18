import React from 'react';
import PropTypes from 'prop-types';

import mapLocation from 'shared/services/map-location';
import MapInteractive from 'components/MapEditor';

import MAP_OPTIONS, { DEFAULT_MARKER_POSITION } from 'shared/services/configuration/map-options';
import Header from '../Header';

const MapInput = ({
  handler, touched, hasError, meta, parent, getError, validatorsOrOpts,
}) => {
  const value = handler().value || {
    geometrie: {
      type: "Point",
      coordinates: [DEFAULT_MARKER_POSITION.lng, DEFAULT_MARKER_POSITION.lat],
    }, address: {

    },
  };

  /* istanbul ignore next */
  const onLocationChange = d => {
    parent.meta.updateIncident({ location: mapLocation(d) });
  };

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible
        ? (
          <div className={`${meta.className || 'col-12'} mode_input`}>
            <Header
              meta={meta}
              options={validatorsOrOpts}
              touched={touched}
              hasError={hasError}
              getError={getError}
            >
              <div className="invoer">
                {/* The implementation of onLocationChange will follow in the next pr */}
                <MapInteractive onLocationChange={onLocationChange} location={value} options={MAP_OPTIONS}/>
              </div>
            </Header>
          </div>
        )
        : ''}
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
