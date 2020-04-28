import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, themeSpacing } from '@datapunt/asc-ui';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import { incidentType } from 'shared/types';
import { stadsdeelList } from 'signals/incident-management/definitions';
import MapStatic from 'components/MapStatic';

import IconEdit from '../../../../../../../../shared/images/icon-edit.svg';

const MapTile = styled.div`
  float: left;
  margin-right: 10px;
  padding: 0;
  border-style: none;
  cursor: pointer;
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

const Location = ({ incident: { location }, onShowLocation, onEditLocation }) => {
  const latitude = location?.geometrie?.coordinates[1];
  const longitude = location?.geometrie?.coordinates[0];

  const geometry = useMemo(() => ({
    latitude,
    longitude,
  }), [longitude, latitude]);

  return (
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

        {latitude && longitude && (
          <MapTile role="button" onClick={onShowLocation} data-testid="location-button-show">
            <MapStatic
              boundsScaleFactor={0.25}
              height={80}
              markerSize={20}
              width={80}
              {...geometry}
            />
          </MapTile>
        )}

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
      </Description>
    </Fragment>
  );
};

Location.propTypes = {
  incident: incidentType.isRequired,
  onShowLocation: PropTypes.func.isRequired,
  onEditLocation: PropTypes.func.isRequired,
};

export default Location;
