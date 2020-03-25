import React from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from '@datapunt/asc-core';
import { Map as MapComponent, TileLayer } from '@datapunt/react-maps';

const Wrapper = styled(MapComponent)`
  height: 450px;
  width: 100%;
`;

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const hasTouchCapabilities = !!global.L.Browser.touch;

const Map = ({ mapOptions, hasZoomControls, hasAttributionControl, isInteractive, children, ...otherProps }) => {
  const options = {
    ...mapOptions,
    attributionControl: hasAttributionControl,
    dragging: isInteractive && !hasTouchCapabilities,
    tap: isInteractive && !hasTouchCapabilities,
    scrollWheelZoom: isInteractive && !hasTouchCapabilities,
  };

  return (
    <Wrapper data-testid="map-test-id" options={options} {...otherProps}>
      {hasZoomControls && <StyledViewerContainer bottomRight={<Zoom />} />}

      {children}

      <TileLayer
        args={['https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png']}
        options={{
          subdomains: ['t1', 't2', 't3', 't4'],
          tms: true,
          attribution: hasAttributionControl && 'Kaartgegevens CC-BY-4.0 Gemeente Amsterdam',
        }}
      />
    </Wrapper>
  );
};
Map.defaultProps = {
  hasZoomControls: false,
  isInteractive: true,
  hasAttributionControl: true,
};

Map.propTypes = {
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */,
  hasZoomControls: PropTypes.bool,
  hasAttributionControl: PropTypes.bool,
  isInteractive: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default Map;
