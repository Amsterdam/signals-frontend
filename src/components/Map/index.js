import React from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import { Map as MapComponent, TileLayer } from '@datapunt/react-maps';

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const Map = ({ mapOptions, hasZoomControls, isInteractive, children, ...otherProps }) => {
  const hasTouchCapabilities = 'ontouchstart' in window;
  const options = {
    ...mapOptions,
    dragging: isInteractive && !hasTouchCapabilities,
    tap: isInteractive && !hasTouchCapabilities,
    scrollWheelZoom: isInteractive && !hasTouchCapabilities,
  };

  return (
    <MapComponent data-testid="map-base" options={options} {...otherProps}>
      {hasZoomControls && <StyledViewerContainer bottomRight={<Zoom />} />}

      {children}

      <TileLayer
        args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
        options={{
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
          attribution: 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
        }}
      />
    </MapComponent>
  );
};
Map.defaultProps = {
  hasZoomControls: false,
  isInteractive: true,
};

Map.propTypes = {
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */,
  hasZoomControls: PropTypes.bool,
  /**
   *  determines if the component is read only
   *  it sets the intern state of leaflet (Browser.touch) and therefore cannot be tested
  */
  isInteractive: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default Map;
