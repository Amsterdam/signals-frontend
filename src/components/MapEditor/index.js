import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import { feature2location } from 'shared/services/map-location';
import MapComponent from '../Map';

const MapWrapper = styled.div`
  position: relative;
`;

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const Map = ({ location, options, ...otherProps }) => {
  const [latlng, setLatLng] = useState();
  const { lat, lng } = latlng || {};

  useEffect(() => {
    if (!location?.geometrie) return;
    setLatLng(feature2location(location.geometrie));
  }, [location]);

  return (
    <MapWrapper>
      <MapComponent data-testid="map-test-id" lat={lat} lng={lng} options={options} {...otherProps}>
        <StyledViewerContainer bottomRight={<Zoom />} />
      </MapComponent>
    </MapWrapper>
  );
};

Map.propTypes = {
  location: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    address: PropTypes.shape({
      openbare_ruimte: PropTypes.string,
      huisnummer: PropTypes.string,
      huisletter: PropTypes.string,
      huisnummer_toevoeging: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
  }).isRequired,
  options: PropTypes.shape({})
    .isRequired /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */,
};

export default memo(Map);
