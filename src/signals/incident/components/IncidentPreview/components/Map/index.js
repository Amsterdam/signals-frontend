import React from 'react';
import PropTypes from 'prop-types';
import Map from '../../../../../../components/Map';

const MapPreview = ({ label, value, optional }) => (
  <span>
    {!optional || (optional && value) ?
      <span>
        <span className="preview-item-label">{label}</span>
        <span className="preview-item-value">
          {value ?
            <div>
              <div>{value.address ? `${value.address.openbare_ruimte} ${value.address.huisnummer}${value.address.huisletter}` : 'geen adres gevonden'}</div>
              <Map
                preview
                latlng={{ latitude: value.geometrie.coordinates[0], longitude: value.geometrie.coordinates[1] }}
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
