import React from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import { Map as MapComponent, Marker, TileLayer } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';

const Wrapper = styled(MapComponent)`
  height: 450px;
  width: 100%;
`;

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const hasTouchCapabilities = !!global.L.Browser.touch;

const Map = ({ className, lat, lng, mapOptions, icon, hasZoomControls, isInteractive, ...otherProps }) => {
  const options = {
    ...mapOptions,
    dragging: isInteractive && !hasTouchCapabilities,
    tap: false,
    scrollWheelZoom: false,
  };

  return (
    <Wrapper className={className} data-testid="map" options={options} {...otherProps}>
      {hasZoomControls && <StyledViewerContainer bottomRight={<Zoom />} />}

      {lat && lng && <Marker args={[{ lat, lng }]} options={{ icon }} />}

      <TileLayer
        args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
        options={{
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
          attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
        }}
      />
    </Wrapper>
  );
};
Map.defaultProps = {
  className: '',
  icon: markerIcon,
  hasZoomControls: false,
  isInteractive: true,
};

Map.propTypes = {
  className: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */,
  icon: PropTypes.shape({}), // leaflet icon object
  hasZoomControls: PropTypes.bool,
  /**
   *  determines if the component is read only
   *  it sets the intern state of leaflet (Browser.touch) and therefore cannot be tested
  */
  isInteractive: PropTypes.bool,
};

export default Map;
