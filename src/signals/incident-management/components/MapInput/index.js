import React from 'react';
import PropTypes from 'prop-types';

import MapInteractive from 'components/MapInteractive';

import Label from '../Label';

export const MapInput = (props) => {
  const { name, display, onQueryResult } = props;
  const render = ({ handler }) => (
    <div className="map-input">
      <div className="mode_input map rij_verplicht">
        <div className="map-input__label">
          <Label htmlFor={`form${name}`}>{display}</Label>
        </div>

        <div className="map-input__control invoer">
          <MapInteractive location={handler().value} onQueryResult={onQueryResult} />
        </div>

      </div>
    </div>);

  render.propTypes = {
    handler: PropTypes.func.isRequired
  };
  return render;
};

export default MapInput;
