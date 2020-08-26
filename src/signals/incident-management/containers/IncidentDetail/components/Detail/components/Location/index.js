import React, { Fragment, useMemo, useContext } from 'react';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import { locationType } from 'shared/types';
import { stadsdeelList } from 'signals/incident-management/definitions';
import MapStatic from 'components/MapStatic';
import { smallMarkerIcon } from 'shared/services/configuration/map-markers';
import configuration from 'shared/services/configuration/configuration';

import MapDetail from '../../../MapDetail';
import HighLight from '../../../Highlight';
import EditButton from '../../../EditButton';
import IconEdit from '../../../../../../../../shared/images/icon-edit.svg';
import IncidentDetailContext from '../../../../context';

const mapWidth = 80;
const mapHeight = 80;
const mapZoom = 9;

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

const StyledMap = styled(MapDetail)`
  width: ${mapWidth}px;
  height: ${mapHeight}px;
  cursor: pointer;
`;

const Location = ({ location }) => {
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
              {configuration.useStaticMapServer ? (
                <MapStatic boundsScaleFactor={0.25} height={mapHeight} markerSize={20} width={mapWidth} {...geometry} />
              ) : (
                <StyledMap value={location} icon={smallMarkerIcon} zoom={mapZoom} />
              )}
            </MapTile>
          )}

          {location.address_text ? (
            <div>
              {location.stadsdeel && (
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
  location: locationType.isRequired,
};

export default Location;
