import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

import { formatAddress } from 'shared/services/map-location';
import './style.scss';

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ label, value, mapOptions }) => {
  const location = value && value.geometrie && value.geometrie.coordinates;
  const lat = location && location[1];
  const lng = location && location[0];

  return (
    <div className="preview-map">
      <div className="row">
        <div className="col-5 col-md-4">
          <div className="preview-map__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-map__item-value">
            {value && (
              <div>
                <div>{value.address ? formatAddress(value.address) : 'Geen adres gevonden'}</div>
                {location && (
                  <div className="preview-map__item-value-map">
                    <Map lat={lat} lng={lng} mapOptions={mapOptions} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({
    address: PropTypes.object,
    geometrie: PropTypes.object,
  }),
  mapOptions: PropTypes.shape({}).isRequired /** leaflet options */,
};

export default MapPreview;
