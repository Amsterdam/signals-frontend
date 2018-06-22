import React from 'react';
import PropTypes from 'prop-types';
import Map from 'components/Map';

const MapPreview = ({ label, value, optional }) => (
  <span>
    {!optional || (optional && value) ?
      <span>
        <span className="preview-item-label">{label}</span>
        <span className="preview-item-value">
          {value ?
            <div>
              <div>{value.address}</div>
              <Map
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
