import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Map as MapComponent, Marker, TileLayer } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { feature2location } from 'shared/services/map-location';

const MapWrapper = styled.div`
  position: relative;
`;

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const Map = ({ location, options, ...otherProps }) => {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker || !location?.geometrie) return;
    const opacity = 1;
    const latlng = feature2location(location.geometrie);
    marker.setLatLng(latlng);
    marker.setOpacity(opacity);
  }, [marker, location]);

  return (
    <MapWrapper>
      <MapComponent data-testid="map-test-id" options={options} {...otherProps}>
        <StyledViewerContainer bottomRight={<Zoom />} />
        {location && location.geometrie && (
          <Marker
            setInstance={setMarker}
            args={[
              {
                lat: 0,
                lng: 0,
              },
            ]}
            options={{
              icon: markerIcon,
              opacity: 0,
            }}
          />
        )}

        <TileLayer
          args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
          options={{
            subdomains: ['t1', 't2', 't3', 't4'],
            tms: true,
            attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
          }}
        />
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
