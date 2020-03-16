import React from 'react';
import PropTypes from 'prop-types';

import MapEditor from 'components/MapEditor';

import Label from 'components/Label';

export const MapInput = props => {
  const { name, display, onQueryResult } = props;

  const render = ({ handler }) => (
    <div className="map-input">
      <div className="mode_input map rij_verplicht">
        <Label htmlFor={`form${name}`}>{display}</Label>

        <div className="map-input__control invoer">
          <MapEditor location={handler().value} onLocationChange={onQueryResult} />
        </div>

      </div>
    </div>
  );

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };
  return render;
};

export default MapInput;
