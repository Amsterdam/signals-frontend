import React from 'react';
import PropTypes from 'prop-types';

import mapLocation from 'shared/services/map-location';
import MapEditor from 'components/MapEditor';

import MAP_OPTIONS, { DEFAULT_MARKER_POSITION } from 'shared/services/configuration/map-options';
import Header from '../Header';

const MapInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  // The default value should be `{}`.
  // We use this variable just for this PR(#685) so the default marker is rendered for test
  // Will be replaced removed in the next PR by the `{}` value
  const defaultPointValue = {
    geometrie: {
      type: 'Point',
      coordinates: [DEFAULT_MARKER_POSITION.lng, DEFAULT_MARKER_POSITION.lat],
    },
    address: {},
  };

  // We update the incident here just for testing the PR(#685).
  // This call sets a default location in the form so we can test the rest of the wizzard
  // This must be removed in the next PR when click functionality will be added.
  parent.meta.updateIncident({ location: defaultPointValue });

  const value = handler().value || defaultPointValue;

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
              {/* The implementation of onLocationChange will follow in the next pr */}
              <MapEditor onLocationChange={onLocationChange} location={value} mapOptions={MAP_OPTIONS} />
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
