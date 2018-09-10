/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import MapInteractive from '../../../../../../components/MapInteractive';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const MapInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => {
  const value = handler().value || {};

  const onQueryResult = (d) => {
    const location = {};

    if (d.dichtstbijzijnd_adres) {
      location.address = { ...d.dichtstbijzijnd_adres };
      location.address.huisnummer = `${location.address.huisnummer}`;
      location.address.huisnummer_toevoeging = `${location.address.huisnummer_toevoeging}`;
    }

    if (d.omgevingsinfo) {
      location.buurt_code = d.omgevingsinfo.buurtcode;
      location.stadsdeel = d.omgevingsinfo.stadsdeelcode;
    }

    if (d.query) {
      location.geometrie = {
        type: 'Point',
        coordinates: [
          d.query.longitude,
          d.query.latitude
        ]
      };
    }

    parent.meta.setIncident({ location });
  };

  return (
    <div className={`${meta && meta.isVisible ? 'row' : ''}`}>
      {meta && meta.isVisible ?
        <div className={`${meta.className || 'col-12'} mode_input ${touched && hasError('required') ? 'field--invalid' : ''}`}>
          <Title meta={meta} options={validatorsOrOpts} />
          {console.log('required', hasError())}
          <ErrorMessage
            touched={touched}
            hasError={hasError}
            getError={getError}
          />

          <div className="invoer">
            <MapInteractive onQueryResult={onQueryResult} location={value} />
          </div>
        </div>
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
  validatorsOrOpts: PropTypes.object
};

export default MapInput;
