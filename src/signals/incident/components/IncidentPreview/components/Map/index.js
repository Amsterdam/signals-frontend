import React from 'react';
import PropTypes from 'prop-types';
import MapContainer from '../../../../../../containers/MapContainer';

const MapPreview = ({ label, value, optional }) => (
  <span>
    {!optional || (optional && value) ?
      <span>
        <span className="preview-item-label">{label}</span>
        <span className="preview-item-value">
          {value ?
            <div>
              <div>{value.address}</div>
              <MapContainer
                preview
                latlng={{ lat: value.lat, lng: value.lng }}
              />
            </div>
          : ''}

        </span>
      </span>
      : ''}
  </span>
);

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  optional: PropTypes.bool
};

export default MapPreview;
