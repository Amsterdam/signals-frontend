import React from 'react';
import PropTypes from 'prop-types';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import MapDetail from '../../../MapDetail';

import './style.scss';

const Location = ({ incident, stadsdeelList, locationUpdated, onShowLocation, onEditLocation }) => {
  const address = incident.location.address;
  return (
    <dl className={`location ${locationUpdated ? 'location--highlight' : ''}`}>
      <dt className="location__definition">Locatie</dt>
      <dd className="location__value">
        <button className="location__value-button-edit detail__button--edit" onClick={onEditLocation}></button>
        <button className="location__value-button-show" onClick={onShowLocation} >
          <MapDetail
            value={incident.location}
            hideAttribution
            hideZoomControls
            zoom="10"
          />
        </button>
        {incident.location.address_text ?
          <div className="location__value-address">
            <div>Stadsdeel: {getListValueByKey(stadsdeelList, incident.location.stadsdeel)}</div>
            <div>{address.openbare_ruimte} {address.huisnummer}{address.huisletter}{address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : ''}</div>
            <div>{address.postcode} {address.woonplaats}</div>
          </div>
        : 'Locatie is gepind op de kaart'}
      </dd>
    </dl>
  );
};

Location.propTypes = {
  incident: PropTypes.object.isRequired,
  stadsdeelList: PropTypes.array.isRequired,
  locationUpdated: PropTypes.bool.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired
};

export default Location;
