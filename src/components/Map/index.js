import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from 'styled-components';
import { Map as MapComponent, TileLayer } from '@datapunt/react-maps';

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const StyledMap = styled(MapComponent)`
  cursor: default;

  &.leaflet-drag-target {
    cursor: all-scroll;
  }
`;

const Map = ({ className, mapOptions, hasZoomControls, canBeDragged, children, events, setInstance }) => {
  const hasTouchCapabilities = 'ontouchstart' in window;
  const showZoom = hasZoomControls && !hasTouchCapabilities;
  const options = useMemo(
    () => ({
      ...mapOptions,
      dragging: canBeDragged && !hasTouchCapabilities,
      tap: false,
      scrollWheelZoom: false,
    }),
    [canBeDragged, hasTouchCapabilities, mapOptions]
  );

  return (
    <StyledMap className={className} data-testid="map-base" options={options} events={events} setInstance={setInstance}>
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
    </StyledMap>
  );
};
Map.defaultProps = {
  canBeDragged: true,
  className: '',
  hasZoomControls: false,
};

Map.propTypes = {
  /** When false, the map cannot be dragged by mouse or touch */
  canBeDragged: PropTypes.bool,
  children: PropTypes.node,
  /** @ignore */
  className: PropTypes.string,
  /**
   * Map events
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-event}
   */
  events: PropTypes.shape({}),
  hasZoomControls: PropTypes.bool,
  /**
   * Leaflet configuration options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
  }).isRequired,
  /**
   * useState function that sets a reference to the map instance
   */
  setInstance: PropTypes.func,
};

export default Map;
