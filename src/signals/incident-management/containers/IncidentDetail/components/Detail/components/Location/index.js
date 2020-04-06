import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import { incidentType } from 'shared/types';
import { stadsdeelList } from 'signals/incident-management/definitions';
import MapDetail from '../../../MapDetail';
import HighLight from '../../../Highlight';
import EditButton from '../../../EditButton';

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
  z-index: 0;
`;

const StyledEditButton = styled(EditButton)`
  top: ${themeSpacing(2)};
  z-index: 1;
`;

const Address = styled.div`
  margin-left: ${themeSpacing(12)};
`;

const StyledHighLight = styled(HighLight)`
  z-index: 0;
  width: 100%;

  .highlight__children {
    display: flex;
  }
`;

const Location = ({ incident: { location }, onShowLocation, onEditLocation }) => (
  <Fragment>
    <dt data-testid="detail-location">Locatie</dt>
    <Description>
      <StyledEditButton onClick={onEditLocation} />

      <StyledHighLight subscribeTo={location}>
        <MapTrigger onClick={onShowLocation} data-testid="location-button-show">
          <MapDetail value={location} hideAttribution hideZoomControls useSmallMarker zoom="15" />
        </MapTrigger>

        {location.address_text ? (
          <Address>
            {location.stadsdeel && (
              <div data-testid="location-value-address-stadsdeel">
                Stadsdeel: {getListValueByKey(stadsdeelList, location.stadsdeel)}
              </div>
            )}

            <div data-testid="location-value-address-street">
              {location.address.openbare_ruimte && location.address.openbare_ruimte}{' '}
              {location.address.huisnummer && location.address.huisnummer}
              {location.address.huisletter && location.address.huisletter}
              {location.address.huisnummer_toevoeging ? `-${location.address.huisnummer_toevoeging}` : ''}
            </div>

            <div data-testid="location-value-address-city">
              {location.address.postcode && location.address.postcode}{' '}
              {location.address.woonplaats && location.address.woonplaats}
            </div>
          </Address>
        ) : (
          <Address>
            <span data-testid="location-value-pinned">Locatie is gepind op de kaart</span>
          </Address>
        )}
      </StyledHighLight>
    </Description>
  </Fragment>
);

Location.propTypes = {
  incident: incidentType.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default Location;
