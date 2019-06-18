import React from 'react';
import PropTypes from 'prop-types';
import Map from '../../../../../../components/Map';

import './style.scss';

const formatAddress = (address) => {
  const toevoeging = address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : '';
  const display = `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`;
  return display;
};

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ label, value }) => {
  console.log(label);
  console.log(value);
  return (
    <div className="preview-map">
      <div className="row">
        <div className="col-5 col-md-4">
          <div className="preview-map__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-map__item-value">
            {value ?
              <div>
                <div>
                  {value.address ? formatAddress(value.address) : 'Geen adres gevonden'}
                </div>
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
    </div>
  );
}

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({
    geometrie: PropTypes.object
  })
};

export default MapPreview;
