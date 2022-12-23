// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { Fragment, useContext } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import configuration from 'shared/services/configuration/configuration'
import { smallMarkerIcon } from 'shared/services/configuration/map-markers'
import { getListValueByKey } from 'shared/services/list-helpers/list-helpers'
import { featureToCoordinates } from 'shared/services/map-location'
import { locationType } from 'shared/types'
import { stadsdeelList } from 'signals/incident-management/definitions'
import styled from 'styled-components'

import MapDetail from '../../../../../../../../components/MapDetail'
import IncidentManagementContext from '../../../../../../context'
import IncidentDetailContext from '../../../../context'
import EditButton from '../../../EditButton'
import HighLight from '../../../Highlight'

const mapWidth = 80
const mapHeight = 80
const mapZoom = 9

const MapTile = styled.div`
  float: left;
  margin-right: ${themeSpacing(4)};
  padding: 0;
  border-style: none;
  cursor: pointer;
`

const Description = styled.dd`
  position: relative;
  display: flex;
  z-index: 0;
`

const StyledEditButton = styled(EditButton)`
  top: ${themeSpacing(2)};
  z-index: 1;
`

const StyledHighLight = styled(HighLight)`
  z-index: 0;
  width: 100%;

  .highlight__children {
    display: flex;
  }
`

const StyledMap = styled(MapDetail)`
  width: ${mapWidth}px;
  height: ${mapHeight}px;
  cursor: pointer;
`

const Location = ({ location }) => {
  const { districts } = useContext(IncidentManagementContext)
  const { preview, edit } = useContext(IncidentDetailContext)
  const { lat, lng } = featureToCoordinates(location.geometrie)

  return (
    <Fragment>
      <dt data-testid="detail-location">Locatie</dt>
      <Description>
        <StyledEditButton
          data-testid="editLocationButton"
          icon={<img src="/assets/images/icon-edit.svg" alt="Bewerken" />}
          iconSize={18}
          onClick={() => {
            edit('location')
          }}
          type="button"
          variant="application"
        />

        <StyledHighLight type="location">
          {lat && lng && (
            <MapTile
              role="button"
              onClick={() => {
                preview('location')
              }}
              data-testid="preview-location-button"
            >
              <StyledMap
                key={`${lat},${lng}`}
                value={location}
                icon={smallMarkerIcon}
                zoom={mapZoom}
              />
            </MapTile>
          )}

          {!configuration.featureFlags.fetchDistrictsFromBackend &&
            location.stadsdeel && (
              <div data-testid="location-value-address-district">
                Stadsdeel:{' '}
                {getListValueByKey(stadsdeelList, location.stadsdeel)}
              </div>
            )}

          {location.address_text ? (
            <div>
              {configuration.featureFlags.fetchDistrictsFromBackend &&
                location.area_code &&
                districts && (
                  <div data-testid="location-value-address-district">
                    {configuration.language.district}:{' '}
                    {getListValueByKey(districts, location.area_code)}
                  </div>
                )}

              <div data-testid="location-value-address-street">
                {location.address.openbare_ruimte} {location.address.huisnummer}
                {location.address.huisletter}
                {location.address.huisnummer_toevoeging
                  ? `-${location.address.huisnummer_toevoeging}`
                  : ''}
              </div>

              <div data-testid="location-value-address-city">
                {location.address.postcode} {location.address.woonplaats}
              </div>
            </div>
          ) : (
            <div>
              <span data-testid="location-value-pinned">
                Locatie is gepind op de kaart
              </span>
            </div>
          )}
        </StyledHighLight>
      </Description>
    </Fragment>
  )
}

Location.propTypes = {
  location: locationType.isRequired,
}

export default Location
