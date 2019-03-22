import React from 'react';
import PropTypes from 'prop-types';

import MapInteractive from 'components/MapInteractive';

export const MapInput = (props) => {
  const { name, display, onQueryResult } = props;
  const render = ({ handler }) => (
    <div className="map-input">
      <div className="mode_input map rij_verplicht">
        <div className="map-input__label">
          <label htmlFor={`form${name}`}>{display}</label>
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
