import React from 'react';
import PropTypes from 'prop-types';

import MapEditor from 'components/MapEditor';

import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Header from '../Header';

const MapInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {

  const value = handler().value || {};

  /* istanbul ignore next */
  const onLocationChange = location => {
    parent.meta.updateIncident({ location });
  };

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ? (
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
            <div className="invoer">
              <MapEditor onLocationChange={onLocationChange} value={value} mapOptions={MAP_OPTIONS} />
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
