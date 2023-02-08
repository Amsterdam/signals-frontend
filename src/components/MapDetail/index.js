// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { Marker } from '@amsterdam/react-maps'
import PropTypes from 'prop-types'

import Map from 'components/Map'
import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { featureToCoordinates } from 'shared/services/map-location'
import { locationType } from 'shared/types'

const MapDetail = ({
  value,
  className,
  zoom,
  icon,
  canFocusMarker,
  hasZoomControls,
}) => {
  const { lat, lng } = value?.geometrie
    ? featureToCoordinates(value.geometrie)
    : {}

  const mapOptions = {
    ...MAP_OPTIONS,
    zoom,
    attributionControl: false,
    center: [lat, lng],
  }
  return lat && lng ? (
    <Map
      data-testid="map-detail"
      mapOptions={mapOptions}
      className={className}
      hasZoomControls={hasZoomControls}
    >
      <Marker
        args={[{ lat, lng }]}
        options={{ icon, keyboard: canFocusMarker }}
      />
    </Map>
  ) : null
}

MapDetail.defaultProps = {
  className: '',
  hasZoomControls: false,
  canFocusMarker: true,
  icon: markerIcon,
}

MapDetail.propTypes = {
  className: PropTypes.string,
  hasZoomControls: PropTypes.bool,
  icon: PropTypes.shape({}), // leaflet icon object
  canFocusMarker: PropTypes.bool,
  value: locationType.isRequired,
  zoom: PropTypes.number.isRequired,
}

export default MapDetail
