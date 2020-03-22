import React from 'react';
import PropTypes from 'prop-types';

import { formatAddress } from 'shared/services/map-location';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import './style.scss';
import Map from 'components/Map';
import styled from '@datapunt/asc-core';

const StyledMap = styled(Map)`
  width: 100%;
  height: 300px;
`;

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ label, value }) => {
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
                {lat && lng && (
                  <div className="preview-map__item-value-map">
                    <StyledMap lat={lat} lng={lng} mapOptions={MAP_OPTIONS} />
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
