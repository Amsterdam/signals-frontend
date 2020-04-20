import React from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from 'styled-components';
import { Map as MapComponent, TileLayer } from '@datapunt/react-maps';

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const Map = ({ mapOptions, hasZoomControls, canBeDragged, children, events, ...otherProps }) => {
  const hasTouchCapabilities = 'ontouchstart' in window;
  const showZoom = hasZoomControls && !hasTouchCapabilities;
  const options = {
    ...mapOptions,
    dragging: canBeDragged && !hasTouchCapabilities,
    tap: false,
    scrollWheelZoom: false,
  };

  return (
    <MapComponent data-testid="map-base" options={options} events={events} {...otherProps}>
      {showZoom && <StyledViewerContainer bottomRight={<Zoom />} />}

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
  canBeDragged: true,
  hasZoomControls: false,
};

Map.propTypes = {
  canBeDragged: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  hasZoomControls: PropTypes.bool,
  /**
   * Leaflet configuration options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired,
  /**
   * Map events
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-event}
   */
  events: PropTypes.shape({}),
};

export default Map;
