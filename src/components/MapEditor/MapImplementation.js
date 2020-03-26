import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import { Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { feature2location } from 'shared/services/map-location';
import MapBase from '../MapBase';
import MapContext from '../MapContainer/context';
import { setLocationAction } from '../MapContainer/actions';

const StyledMap = styled(MapBase)`
  height: 450px;
  width: 100%;
`;

const MapImplementation = ({ value, ...otherProps }) => {
  const { state, dispatch, onChange } = useContext(MapContext);
  const [marker, setMarker] = useState();
  const { location } = state;
  const hasLocation = location && location.lat && location.lng;

  useEffect(() => {
    if (!value?.geometrie) return;
    const loc = feature2location(value.geometrie);
    dispatch(setLocationAction(loc));
  }, [value, dispatch]);

  const clickHandler = e => {
    dispatch(setLocationAction(e.latlng));
  };

  useEffect(() => {
    if (!marker || !state?.location) return;

    marker.setLatLng(location);
    marker.setOpacity(1);

    // Pass the state back to the parent.
    onChange(state);
  }, [marker, location, state, onChange]);

  return (
    <StyledMap {...otherProps} events={{ click: clickHandler }}>
      {hasLocation && (
        <Marker
          setInstance={setMarker}
          args={[location]}
          options={{
            icon: markerIcon,
            opacity: 0,
          }}
        />
      )}
    </StyledMap>
  );
};

MapImplementation.defaultProps = {};

MapImplementation.propTypes = {
  value: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    address: PropTypes.shape({
      openbare_ruimte: PropTypes.string,
      huisnummer: PropTypes.string,
      huisletter: PropTypes.string,
      huisnummer_toevoeging: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
  }).isRequired,
};

export default MapImplementation;
