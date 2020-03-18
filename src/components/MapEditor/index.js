import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Map as MapComponent, Marker } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import BackgroundLayer from 'components/BackgroundLayer';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { feature2location } from 'shared/services/map-location';

const MapWrapper = styled.div`
  position: relative;
`;

const StyledMap = styled(MapComponent)`
  width: 100%;
  height: 450px;
`;

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400;
`;

const Map = ({ location, options }) => {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker || !location.geometrie) return;
    const opacity = 1;
    const latlng = feature2location(location.geometrie);
    marker.setLatLng(latlng);
    marker.setOpacity(opacity);
  }, [marker, location]);

  return (
    <MapWrapper>
      <StyledMap options={options}>
        <StyledViewerContainer bottomRight={<Zoom />} />
        {location && location.geometrie && (
          <Marker
            setInstance={setMarker}
            args={[{
              lat: 0,
              lng: 0,
            }]}
            options={{
              icon: markerIcon,
              opacity: 0,
            }}
          />
        )}

        <BackgroundLayer />
      </StyledMap>
    </MapWrapper>
  );
};

Map.propTypes = {
  location: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string,
      coordinates: [PropTypes.number, PropTypes.number],
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
