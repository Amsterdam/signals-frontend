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
              {value.geometrie && value.geometrie.coordinates ?
                <Map
                  preview
                  latlng={{ latitude: value.geometrie.coordinates[1], longitude: value.geometrie.coordinates[0] }}
                />
              : ''}
            </div>
          : ''}

        </span>
      </span>
      : ''}
  </span>
);

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.object,
  optional: PropTypes.bool
};

export default MapPreview;
