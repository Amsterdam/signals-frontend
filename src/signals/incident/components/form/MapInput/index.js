import React from 'react';
import PropTypes from 'prop-types';

import MapEditor from 'components/MapEditor';

import Header from '../Header';
import { DEFAULT_MARKER_POSITION } from '../../../../../shared/services/configuration/map-options';

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
  const onLocationChange = location => {
    parent.meta.updateIncident({ location });
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
                <MapEditor onLocationChange={onLocationChange} location={value} />
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
