/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import MapInteractive from '../../../../../../components/MapInteractive';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const MapInput = ({ handler, touched, hasError, meta, parent }) => {
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
          d.query.latitude,
          d.query.longitude
        ]
      };
    }

    parent.meta.setIncident({ location });
  };

  return (
    <div>
      {meta.ifVisible ?
        <div className="row">
          <Title meta={meta} />

          <div className={`col-${meta.cols || 12} invoer`}>
            <MapInteractive onQueryResult={onQueryResult} location={value} />
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
