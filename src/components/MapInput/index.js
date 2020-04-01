import React, { useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import { Marker } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import { location2feature } from 'shared/services/map-location';
import MapContext from 'containers/MapContext/context';
import { setLocationAction, setValuesAction, setAddressAction } from 'containers/MapContext/actions';
import Map from '../Map';
import PDOKAutoSuggest from '../PDOKAutoSuggest';
import reverseGeocoderService from './services/reverseGeocoderService';

const Wrapper = styled.div`
  position: relative;
`;

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
`;

const StyledAutosuggest = styled(PDOKAutoSuggest)`
  position: absolute;
  top: 30px;
  left: 20px;
  width: calc(100% - 40px);
  z-index: 401; // 400 is the minimum elevation were elements are shown above the map
`;

const MapInput = ({ className, value, onChange, mapOptions, ...otherProps }) => {
  const { state, dispatch } = useContext(MapContext);
  const [map, setMap] = useState();
  const [marker, setMarker] = useState();
  const { location, addressText: addressValue } = state;
  const hasLocation = location && location?.lat !== 0  && location.lng !== 0;

  useEffect(() => {
    dispatch(setValuesAction(value));
  }, [value, dispatch]);

  const clickHandler = async e => {
    dispatch(setLocationAction(e.latlng));
    const addressText = await reverseGeocoderService(e.latlng);
    dispatch(setAddressAction(addressText));
    onChange({ geometrie: location2feature(e.latlng), addressText });
  };

  const onSelect = useCallback(option => {
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

    if (map) {
      const currentZoom = map.getZoom();
      map.flyTo(location, currentZoom < 11 ? 11 : currentZoom);
    }
  }, [map, dispatch, onChange]);

  useEffect(() => {
    if (!marker || !hasLocation) return;
    marker.setLatLng(location);
  }, [marker, location, hasLocation]);

  return (
    <Wrapper>
      <StyledAutosuggest value={addressValue} onSelect={onSelect} gemeentenaam="amsterdam" />
      <StyledMap
        className={className}
        data-testid="map-input"
        mapOptions={mapOptions}
        events={{ click: clickHandler }}
        setInstance={setMap}
        {...otherProps}
      >
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
    </Wrapper>
  );
};

MapInput.defaultProps = {};

MapInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.shape({
    geometrie: PropTypes.shape({
      type: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
    addressText: PropTypes.string,
  }),
  onChange: PropTypes.func,
  mapOptions: PropTypes.shape({}).isRequired, /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */
};

export default MapInput;
