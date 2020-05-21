import React from 'react';
import PropTypes from 'prop-types';

import MapInputComponent from 'components/MapInput';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import { formatMapLocation } from 'shared/services/map-location';

import Label from 'components/Label';

export const MapInput = props => {
  const { name, display, onQueryResult } = props;

  // Can't use useCallback here, would break the rules of hooks
  const render = ({ handler }) => {
    const value = formatMapLocation(handler().value || {});
    const { lat, lng } = value?.location || {};
    const mapOptions = {
      ...MAP_OPTIONS,
      center: lat && lng ? [lat, lng] : [...MAP_OPTIONS.center],
    };

    const onLocationChange = location => {
      onQueryResult(location);
    };

    return (
      <div className="map-input">
        <div className="mode_input map rij_verplicht">
          <Label htmlFor={`form${name}`}>{display}</Label>

          <div className="map-input__control invoer">
            <MapInputComponent value={value} onChange={onLocationChange} mapOptions={mapOptions} hasZoomControls />
          </div>
        </div>
      </div>
    );
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };

  return render;
};

export default MapInput;
