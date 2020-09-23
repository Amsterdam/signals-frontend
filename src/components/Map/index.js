import React, { useMemo, useState, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ViewerContainer } from '@datapunt/asc-ui';
import { Zoom } from '@datapunt/amsterdam-react-maps/lib/components';
import styled from 'styled-components';
import { Map as MapComponent, TileLayer } from '@datapunt/react-maps';
import { useDispatch } from 'react-redux';

import { TYPE_LOCAL, VARIANT_NOTICE } from 'containers/Notification/constants';
import { showGlobalNotification } from 'containers/App/actions';
import configuration from 'shared/services/configuration/configuration';
import GPSButton from '../GPSButton';
import LocationMarker from '../LocationMarker';

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 400; // this elevation ensures that this container comes on top of the internal leaflet components
`;

const StyledMap = styled(MapComponent)`
  cursor: default;

  &.leaflet-drag-target {
    cursor: all-scroll;
  }
`;

const StyledGPSButton = styled(GPSButton)`
  margin-bottom: 8px;
`;

const Map = ({
  canBeDragged,
  children,
  className,
  'data-testid': dataTestId,
  events,
  hasGPSControl,
  hasZoomControls,
  mapOptions,
  setInstance,
}) => {
  const dispatch = useDispatch();
  const [mapInstance, setMapInstance] = useState();
  const [geolocation, setGeolocation] = useState();
  const hasTouchCapabilities = 'ontouchstart' in window;
  const showZoom = hasZoomControls && !hasTouchCapabilities;
  const maxZoom = mapOptions.maxZoom || configuration.map.options.maxZoom;
  const minZoom = mapOptions.minZoom || configuration.map.options.minZoom;
  const options = useMemo(() => {
    const center = geolocation ? [geolocation.latitude, geolocation.longitude] : mapOptions.center;

    return {
      ...{ ...mapOptions, center },
      maxZoom,
      minZoom,
      dragging: canBeDragged && !hasTouchCapabilities,
      tap: false,
      scrollWheelZoom: false,
    };
  }, [canBeDragged, hasTouchCapabilities, mapOptions, geolocation, maxZoom, minZoom]);

  useLayoutEffect(() => {
    if (!mapInstance || !geolocation || !geolocation.toggled) return;

    mapInstance.flyTo([geolocation.latitude, geolocation.longitude], maxZoom, { animate: true, noMoveStart: true });
  }, [geolocation, mapInstance, maxZoom]);

  const captureInstance = useCallback(
    instance => {
      setMapInstance(instance);

      if (typeof setInstance === 'function') {
        setInstance(instance);
      }
    },
    [setInstance]
  );

  return (
    <StyledMap
      className={className}
      data-testid={dataTestId}
      data-max-zoom={maxZoom}
      data-min-zoom={minZoom}
      events={events}
      options={options}
      setInstance={captureInstance}
    >
      <StyledViewerContainer
        bottomRight={
          <div data-testid="mapZoom">
            {hasGPSControl && (
              <StyledGPSButton
                onLocationSuccess={location => {
                  setGeolocation(location);
                }}
                onLocationError={() => {
                  dispatch(
                    showGlobalNotification({
                      variant: VARIANT_NOTICE,
                      title: 'meldingen.amsterdam.nl heeft geen toestemming om uw locatie te gebruiken.',
                      message: 'Dit kunt u wijzigen in de voorkeuren of instellingen van uw browser of systeem.',
                      type: TYPE_LOCAL,
                    })
                  );
                }}
                onLocationOutOfBounds={() => {
                  dispatch(
                    showGlobalNotification({
                      variant: VARIANT_NOTICE,
                      title: 'Uw locatie valt buiten de kaart en is daardoor niet te zien',
                      type: TYPE_LOCAL,
                    })
                  );
                }}
              />
            )}
            {showZoom && <Zoom />}
          </div>
        }
      />

      {geolocation?.toggled && <LocationMarker geolocation={geolocation} />}

      {children}

      <TileLayer args={configuration.map.tiles.args} options={configuration.map.tiles.options} />
    </StyledMap>
  );
};

Map.defaultProps = {
  canBeDragged: true,
  className: '',
  'data-testid': 'map-base',
  hasGPSControl: false,
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
  'data-testid': PropTypes.string,
  events: PropTypes.shape({}),
  hasGPSControl: PropTypes.bool,
  hasZoomControls: PropTypes.bool,
  /**
   * Leaflet configuration options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
  mapOptions: PropTypes.shape({
    attributionControl: PropTypes.bool,
    center: PropTypes.arrayOf(PropTypes.number),
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
  }).isRequired,
  /**
   * useState function that sets a reference to the map instance
   */
  setInstance: PropTypes.func,
};

export default Map;
