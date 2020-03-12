import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMapInstance, Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import mapLocation, {
  getLocation,
  formatAddress,
} from 'shared/services/map-location';
import {
  searchTermSelected,
} from './ducks';
import { useGeocoderContext } from './GeocoderContext';

const DEFAULT_MARKER_POSITION = {
  lat: 52.3731081,
  lng: 4.8932945,
};

const GeocoderMarker = ({ pointQueryService, children }) => {
  const mapInstance = useMapInstance();
  const [marker, setMarker] = useState();
  const { location, state, dispatch, onLocationChange } = useGeocoderContext();
  const { term } = state;
  const [markerLocation, setMarkerLocation] = useState();
  const opacity = term === '' ? 0 : 1;

  useEffect(() => {
    if (!mapInstance || !marker || !markerLocation) return;
    // todo compare marker.getLatLng with location.location and then fly
    marker.setLatLng(markerLocation);
    const currentZoom = mapInstance.getZoom();
    mapInstance.flyTo(markerLocation, currentZoom < 11 ? 11 : currentZoom);
    marker.setOpacity(1);
    setMarkerLocation(markerLocation);
  }, [mapInstance, marker, markerLocation]);

  useEffect(() => {
    if (!location || !marker) return;
    const { location: latlng } = mapLocation(location);
    console.log(location);
    if (latlng) {
      marker.setLatLng(latlng);
      marker.setOpacity(1);
    }

    dispatch(
      searchTermSelected(
        location.address ? formatAddress(location.address) : ''
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, marker]);

  useEffect(() => {
    const clickHandler = async e => {
      const pointInfo = await pointQueryService(e);
      console.log(pointInfo);
      onLocationChange(getLocation(pointInfo));
    };

    if (mapInstance) {
      mapInstance.on('click', clickHandler);
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('click', clickHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  return (<React.Fragment>
    <Marker
      setInstance={setMarker}
      args={[DEFAULT_MARKER_POSITION]}
      options={{
        icon: markerIcon,
        opacity,
      }}
    />
    {children}
  </React.Fragment>
  );
};

GeocoderMarker.propTypes = {
  pointQueryService: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default GeocoderMarker;
