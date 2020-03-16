import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMapInstance, Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { formatAddress, feature2location } from 'shared/services/map-location';
import { searchTermSelected } from './ducks';
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

  useEffect(() => {
    if (!mapInstance || !marker || !location.geometrie) return;
    const addressText = formatAddress(location.address);
    const latlng = feature2location(location.geometrie);
    marker.setLatLng(latlng);
    const opacity = addressText === '' ? 0 : 1;
    marker.setOpacity(opacity);

    const shouldFlyTo = term === addressText;
    if (shouldFlyTo) {
      const currentZoom = mapInstance.getZoom();
      mapInstance.flyTo(latlng, currentZoom < 11 ? 11 : currentZoom);
    } else {
      dispatch(searchTermSelected(addressText));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance, marker, location]);

  useEffect(() => {
    const clickHandler = async e => {
      const pointInfo = await pointQueryService(e);
      onLocationChange(pointInfo);
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

  return (
    <React.Fragment>
      <Marker
        setInstance={setMarker}
        args={[DEFAULT_MARKER_POSITION]}
        options={{
          icon: markerIcon,
          opacity: 0,
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
