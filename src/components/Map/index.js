import React from 'react';
import PropTypes from 'prop-types';
import { Map as ArmMap, TileLayer, Marker } from '@datapunt/react-maps';
import { getCrsRd } from '@datapunt/amsterdam-react-maps/lib/utils';
import styled from '@datapunt/asc-core';
import { AmsterdamMarkerIcon } from '../Geocoder/MarkerIcons';

const MapWrapperStyle = styled.div`
  position: relative;
`;

const Map = ({ latlng }) => {
  const { latitude: lat, longitude: lon } = latlng;
  const mapProps = {
    options: {
      center: [lat, lon],
      zoomControl: false,
      zoom: 16,
      crs: getCrsRd(),
      maxBounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
    },
    style: {
      width: '100%',
      height: '450px',
    },
  };

  return (
    <MapWrapperStyle>
      <ArmMap {...mapProps}>
        <Marker
          args={[{ lat, lon }]}
          options={{
            icon: AmsterdamMarkerIcon,
          }}
        />
        <TileLayer
          args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
          options={{
            subdomains: ['t1', 't2', 't3', 't4'],
            tms: true,
            attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
          }}
        />
      </ArmMap>
    </MapWrapperStyle>
  );
};

Map.propTypes = {
  latlng: PropTypes.shape(
    {
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }
  ).isRequired,
};

export default Map;
