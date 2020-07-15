import React, { Fragment, useMemo, useContext } from 'react';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import configuration from 'shared/services/configuration/configuration';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import { dataListType, locationType } from 'shared/types';
import { stadsdeelList } from 'signals/incident-management/definitions';
import MapStatic from 'components/MapStatic';

import HighLight from '../../../Highlight';
import EditButton from '../../../EditButton';
import IconEdit from '../../../../../../../../shared/images/icon-edit.svg';
import IncidentDetailContext from '../../../../context';

const MapTile = styled.div`
  float: left;
  margin-right: ${themeSpacing(4)};
  padding: 0;
  border-style: none;
  cursor: pointer;
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

const StyledHighLight = styled(HighLight)`
  z-index: 0;
  width: 100%;

  .highlight__children {
    display: flex;
  }
`;

const Location = ({ districts, location }) => {
  const { preview, edit } = useContext(IncidentDetailContext);
  const latitude = location?.geometrie?.coordinates[1];
  const longitude = location?.geometrie?.coordinates[0];

  const geometry = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [longitude, latitude]
  );

  return (
    <Fragment>
      <dt data-testid="detail-location">Locatie</dt>
      <Description>
        <StyledEditButton
          data-testid="editLocationButton"
          icon={<IconEdit />}
          iconSize={18}
          onClick={() => {
            edit('location');
          }}
          type="button"
          variant="application"
        />

        <StyledHighLight type="location">
          {latitude && longitude && (
            <MapTile
              role="button"
              onClick={() => {
                preview('location');
              }}
              data-testid="previewLocationButton"
            >
              <MapStatic boundsScaleFactor={0.25} height={80} markerSize={20} width={80} {...geometry} />
            </MapTile>
          )}

          {location.address_text ? (
            <div>
              {configuration.useAreasInsteadOfStadsdeel && location.area_code && (
                <div data-testid="location-value-address-stadsdeel">
                  {configuration.language.district}: {getListValueByKey(districts, location.area_code)}
                </div>
              )}
              {!configuration.useAreasInsteadOfStadsdeel && location.stadsdeel && (
                <div data-testid="location-value-address-stadsdeel">
                  Stadsdeel: {getListValueByKey(stadsdeelList, location.stadsdeel)}
                </div>
              )}

              <div data-testid="location-value-address-street">
                {location.address.openbare_ruimte} {location.address.huisnummer}
                {location.address.huisletter}
                {location.address.huisnummer_toevoeging ? `-${location.address.huisnummer_toevoeging}` : ''}
              </div>

              <div data-testid="location-value-address-city">
                {location.address.postcode} {location.address.woonplaats}
              </div>
            </div>
          ) : (
            <div>
              <span data-testid="location-value-pinned">Locatie is gepind op de kaart</span>
            </div>
          )}
        </StyledHighLight>
      </Description>
    </Fragment>
  );
};

Location.propTypes = {
  districts: dataListType,
  location: locationType.isRequired,
};

export default Location;
