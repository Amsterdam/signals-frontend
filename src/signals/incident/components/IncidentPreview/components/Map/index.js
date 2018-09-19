import React from 'react';
import PropTypes from 'prop-types';
import Map from '../../../../../../components/Map';

import './style.scss';

const MapPreview = ({ label, value, optional }) => (
  <div className="preview-map">
    {!optional || (optional && value) ?
      <div className="row">
        <div className="col-5 col-md-4">
          <div className="preview-map__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-map__item-value">
            {value ?
              <div>
                <div>
                  {value.address ? `${value.address.openbare_ruimte} ${value.address.huisnummer}${value.address.huisletter}` : 'geen adres gevonden'}</div>
                {value.geometrie && value.geometrie.coordinates ?
                  <div className="preview-map__item-value-map">
                    <Map
                      latlng={{ latitude: value.geometrie.coordinates[1], longitude: value.geometrie.coordinates[0] }}
                    />
                  </div>
                : ''}
              </div>
              : ''}
          </div>
        </div>
      </div>
      : ''}
  </div>
);

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.object,
  optional: PropTypes.bool
};

export default MapPreview;
