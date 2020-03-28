import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import { Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { feature2location, location2feature } from 'shared/services/map-location';
import MapBase from '../MapBase';
import MapContext from '../MapContainer/context';
import { setLocationAction, setValuesAction, setAddressAction } from '../MapContainer/actions';
import PDOKAutoSuggest from '../PDOKAutoSuggest';
import reverseGeocoderService from './services/reverseGeocoderService';

const StyledMap = styled(MapBase)`
  height: 450px;
  width: 100%;
`;

const StyledAutosuggest = styled(PDOKAutoSuggest)`
  position: absolute;
  top: 30px;
  left: 20px;
  width: calc(100% - 40px);
  z-index: 401;
`;

const MapImplementation = ({ value, onChange, ...otherProps }) => {
  const { state, dispatch } = useContext(MapContext);
  const [marker, setMarker] = useState();
  const { location } = state;
  const hasLocation = location && location.lat && location.lng;

  useEffect(() => {
    if (!value?.geometrie) return;
    const loc = feature2location(value.geometrie);
    dispatch(setLocationAction(loc));
  }, [value, dispatch]);

  const clickHandler = async e => {
    dispatch(setLocationAction(e.latlng));
    const addressText = await reverseGeocoderService(e.latlng);
    dispatch(setAddressAction(addressText));
    onChange({ geometrie: location2feature(e.latlng), addressText });
  };

  const onSelect = option => {
    // eslint-disable-next-line no-shadow
    const { location, value: addressText } = option;

    dispatch(
      setValuesAction({
        location,
        addressText,
      })
    );

    onChange({
      geometrie: location2feature(location),
      addressText,
    });
  };

  useEffect(() => {
    if (!marker || !hasLocation) return;
    marker.setLatLng(location);
  }, [marker, location, hasLocation]);

  return (
    <React.Fragment>
      <StyledAutosuggest value={value.addressText} onSelect={onSelect} gemeentenaam="amsterdam" />
      <StyledMap {...otherProps} events={{ click: clickHandler }} >
        {hasLocation && (
          <Marker
            setInstance={setMarker}
            args={[location]}
            options={{
              icon: markerIcon,
            }}
          />
        )}
      </StyledMap>
    </React.Fragment>
  );
};

MapImplementation.defaultProps = {};

MapImplementation.propTypes = {
  value: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    addressText: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default MapImplementation;
