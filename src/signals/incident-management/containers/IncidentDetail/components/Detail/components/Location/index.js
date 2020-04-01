import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, themeSpacing } from '@datapunt/asc-ui';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import { incidentType } from 'shared/types';
import { stadsdeelList } from 'signals/incident-management/definitions';
import IconEdit from '../../../../../../../../shared/images/icon-edit.svg';
import MapDetail from '../../../MapDetail';

const MapTrigger = styled.div`
  width: ${themeSpacing(10)};

  #mapdiv {
    height: 80px !important;
    width: 80px !important;
  }
`;

const Description = styled.dd`
  position: relative;
  display: flex;
`;

const EditButton = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`;

const Address = styled.div`
  margin-left: ${themeSpacing(12)};
`;

const Location = ({ incident: { location }, onShowLocation, onEditLocation }) => (
  <Fragment>
    <dt data-testid="detail-location">Locatie</dt>
    <Description>
      <EditButton
        variant="application"
        iconSize={20}
        icon={<IconEdit />}
        type="button"
        onClick={onEditLocation}
        data-testid="location-button-edit"
      />

      <MapTrigger onClick={onShowLocation} data-testid="location-button-show">
        <MapDetail value={location} hideAttribution hideZoomControls useSmallMarker zoom="15" />
      </MapTrigger>

      {location.address_text ? (
        <Address>
          <div data-testid="location-value-address-stadsdeel">
            Stadsdeel: {getListValueByKey(stadsdeelList, location.stadsdeel)}
          </div>
          <div data-testid="location-value-address-street">
            {location.address.openbare_ruimte} {location.address.huisnummer}
            {location.address.huisletter}
            {location.address.huisnummer_toevoeging ? `-${location.address.huisnummer_toevoeging}` : ''}
          </div>
          <div data-testid="location-value-address-city">
            {location.address.postcode} {location.address.woonplaats}
          </div>
        </Address>
      ) : (
        <span data-testid="location-value-pinned">Locatie is gepind op de kaart</span>
      )}
    </Description>
  </Fragment>
);

Location.propTypes = {
  incident: incidentType.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default Location;
