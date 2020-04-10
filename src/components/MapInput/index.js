import React, { useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import styled from '@datapunt/asc-core';
import { Marker } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import 'leaflet/dist/leaflet.css';

import { markerIcon } from 'shared/services/configuration/map-markers';
import { locationTofeature, formatPDOKResponse } from 'shared/services/map-location';
import MapContext from 'containers/MapContext/context';
import { setLocationAction, setValuesAction } from 'containers/MapContext/actions';

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

const StyledViewerContainer = styled(ViewerContainer)`
  & > * {
    width: 100%;
  }
`;

const StyledAutosuggest = styled(PDOKAutoSuggest)`
  position: absolute;
  left: 0;
  width: 40%;
  max-width: calc(100% - 40px);
  z-index: 401; // 400 is the minimum elevation were elements are shown above the map

  @media (max-width: ${({ theme }) => theme.layouts.large.max}px) {
    width: 60%;
  }

  @media (max-width: ${({ theme }) => theme.layouts.medium.max}px) {
    width: 100%;
  }
`;

const MapInput = ({ className, value, onChange, mapOptions, ...otherProps }) => {
  const { state, dispatch } = useContext(MapContext);
  const [map, setMap] = useState();
  const [marker, setMarker] = useState();
  const { location, addressText: addressValue } = state;
  const hasLocation = location && location?.lat !== 0 && location.lng !== 0;

  useEffect(() => {
    if (!value?.geometrie?.coordinates && !value?.addressText) return;

    dispatch(setValuesAction(value));
  }, [value, dispatch]);

  const clickHandler = useCallback(
    async event => {
      dispatch(setLocationAction(event.latlng));

      const response = await reverseGeocoderService(event.latlng);

      const onChangePayload = {
        geometrie: locationTofeature(event.latlng),
      };

      const addressText = response?.value || '';
      const address = response?.data?.address || '';
      const stadsdeel = response?.data?.stadsdeel || '';

      if (response) {
        onChangePayload.address = response.data.address;
        onChangePayload.stadsdeel = response.data.stadsdeel;
      }

      dispatch(
        setValuesAction({
          addressText,
          address,
          stadsdeel,
        })
      );

      onChange(onChangePayload);
    },
    [dispatch, onChange]
  );

  const onSelect = useCallback(
    /* istanbul ignore next */ option => {
      dispatch(setValuesAction({ location: option.data.location, address: option.data.address, addressText: value }));

      onChange({
        geometrie: locationTofeature(option.data.location),
        address: option.data.address,
      });

      if (map) {
        const currentZoom = map.getZoom();
        map.flyTo(option.data.location, currentZoom < 11 ? 11 : currentZoom);
      }
    },
    [map, dispatch, onChange, value]
  );

  useEffect(() => {
    if (!marker || !hasLocation) return;

    marker.setLatLng(location);
  }, [marker, location, hasLocation]);

  return (
    <Wrapper>
      <StyledMap
        className={className}
        data-testid="map-input"
        events={{ click: clickHandler }}
        hasZoomControls
        mapOptions={mapOptions}
        setInstance={setMap}
        {...otherProps}
      >
        <StyledViewerContainer
          topLeft={
            <StyledAutosuggest
              value={addressValue}
              onSelect={onSelect}
              gemeentenaam="amsterdam"
              placeholder="Zoek adres"
              formatResponse={formatPDOKResponse}
            />
          }
        />
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
  /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */
  mapOptions: PropTypes.shape({}).isRequired,
};

export default MapInput;
