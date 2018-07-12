/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import Map from '../../../../../../components/Map';

import Title from '../Title/';
import ErrorMessage from '../ErrorMessage/';

const MapInput = ({ handler, touched, hasError, meta, parent }) => {
  const value = handler().value;
  let latlng;

  if (value && value.geometrie && value.geometrie.coordinates) {
    console.log('value', value);
    latlng = {
      latitude: value.geometrie.coordinates[0],
      longitude: value.geometrie.coordinates[1]
    };
    console.log('latlng', latlng);
  }

  const onQueryResult = (d) => {
    console.log('onQueryResult', d);
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

/*
location: {
  address: {
    openbare_ruimte: 'Dam',
    huisnummer: '1',
    huisletter: 'A',
    huisnummer_toevoeging: '1',
    postcode: '1012JS',
    woonplaats: 'Amsterdam'
  },
  buurt_code: 'abc',
  geometrie: {
    type: 'Point',
    coordinates: [
      incident.location.lat,
      incident.location.lng
    ]
  },
  stadsdeel: 'A',
  extra_properties: {}
},

*/

  return (
    <div>
      {meta.ifVisible ?
        <div className="row">
          <Title meta={meta} />

          <div className={`col-${meta.cols || 12} invoer`}>
            <Map onQueryResult={onQueryResult} latlng={latlng} />
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
