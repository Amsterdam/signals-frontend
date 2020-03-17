import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import { incidentType, dataListType } from 'shared/types';

import MapDetail from '../../../MapDetail';

import './style.scss';

const MapButton = styled.button`
  float: left;
  margin-right: 10px;
  padding: 0;
  border-style: none;
  cursor: pointer;
`;

const Location = ({ incident, stadsdeelList, onShowLocation, onEditLocation }) => {
  const address = incident.location.address;
  return (
    <dl className="location">
      <dt className="location__definition" data-testid="location-definition">
        Locatie
      </dt>
      <dd className="location__value">
        <button
          className="location__value-button-edit incident-detail__button--edit"
          type="button"
          onClick={onEditLocation}
          data-testid="location-button-edit"
        ></button>
        <MapButton type="button" onClick={onShowLocation} data-testid="location-button-show">
          <MapDetail
            value={incident.location}
            smallMarker
            attributionControl={false}
            zoom={15}
            width="80px"
            height="80px"
          />
        </MapButton>
        {incident.location.address_text ? (
          <div className="location__value-address">
            <div data-testid="location-value-address-stadsdeel">
              Stadsdeel: {getListValueByKey(stadsdeelList, incident.location.stadsdeel)}
            </div>
            <div data-testid="location-value-address-street">
              {address.openbare_ruimte} {address.huisnummer}
              {address.huisletter}
              {address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : ''}
            </div>
            <div data-testid="location-value-address-city">
              {address.postcode} {address.woonplaats}
            </div>
          </div>
        ) : (
          <span data-testid="location-value-pinned">Locatie is gepind op de kaart</span>
        )}
      </dd>
    </dl>
  );
};

Location.propTypes = {
  incident: incidentType.isRequired,
  stadsdeelList: dataListType.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default Location;
