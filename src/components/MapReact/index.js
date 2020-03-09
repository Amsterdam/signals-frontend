import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from '@datapunt/react-maps';
import { getCrsRd } from '@datapunt/amsterdam-react-maps/lib/utils';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import Geocoder, { getSuggestions, getAddressById } from '../Geocoder';

const geocoderProps = {
  getSuggestions,
  getAddressById,
};

const mapProps = {
  options: {
    center: [52.3731081, 4.8932945],
    zoom: 10,
    crs: getCrsRd(),
    maxBounds: [
      [52.25168, 4.64034],
      [52.50536, 5.10737],
    ],
  },
  style: {
    width: '100%',
    height: '50vh',
  },
};

const MapReact = ({ location, onLocationChange }) =>
  (
    <div>
      this is the map
      <input value={JSON.stringify(location)} />
      <Map {...mapProps}>
        <ViewerContainer
          // @ts-ignore
          style={{ zIndex: 400 }}
          topLeft={<Geocoder {...geocoderProps} onLocationChange={onLocationChange} />}
          bottomRight={<Zoom />}
        />
        <TileLayer
          args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
          options={{
            subdomains: ['t1', 't2', 't3', 't4'],
            tms: true,
            attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
          }}
        />
      </Map>
    </div>
  )
;

MapReact.propTypes = {
  location: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default MapReact;
