import React from 'react';
import PropTypes from 'prop-types';

import mapLocation from 'shared/services/map-location';
import MapReact from 'components/MapReact';
// import MapReact from 'components/MapInteractive';

import Header from '../Header';

const MapInput = ({
  handler, touched, hasError, meta, parent, getError, validatorsOrOpts,
}) => {
  const value = handler().value || {};

  /* istanbul ignore next */
  const onQueryResult = d => {
    console.log('onQueryResult', d);
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
                {/* <MapReact onQueryResult={onQueryResult} location={value} /> */}
                <MapReact onQueryResult={onQueryResult} location={value} />
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
