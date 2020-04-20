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
import useDelayedDoubleClick from 'hooks/useDelayedDoubleClick';

import Map from '../Map';
import PDOKAutoSuggest from '../PDOKAutoSuggest';
import reverseGeocoderService, { getStadsdeel } from './services/reverseGeocoderService';

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

  const clickFunc = useCallback(
    async event => {
      dispatch(setLocationAction(event.latlng));

      const response = await reverseGeocoderService(event.latlng);
      const stadsdeel = await getStadsdeel(event.latlng);

      const onChangePayload = {
        geometrie: locationTofeature(event.latlng),
        stadsdeel,
      };

      const addressText = response?.value || '';
      const address = response?.data?.address || '';

      if (response) {
        onChangePayload.address = response.data.address;
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
    async option => {
      dispatch(
        setValuesAction({ location: option.data.location, address: option.data.address, addressText: option.value })
      );

      const stadsdeel = await getStadsdeel(option.data.location);

      onChange({
        geometrie: locationTofeature(option.data.location),
        address: option.data.address,
        stadsdeel,
      });

      const currentZoom = map.getZoom();
      map.flyTo(option.data.location, currentZoom < 11 ? 11 : currentZoom);
    },
    [map, dispatch, onChange]
  );

  const { click, doubleClick } = useDelayedDoubleClick(clickFunc);

  const onClear = useCallback(() => {
    dispatch(setLocationAction());
  }, [dispatch]);

  useEffect(() => {
    if (!marker || !hasLocation) return;

    marker.setLatLng(location);
  }, [marker, location, hasLocation]);

  useEffect(() => {
    if (!map) return;
    if (!value?.location) return;

    // This ensures that the map is centered on the location only the first time the map recieves a location from outside
    // because state.location.lat is 0 only when the map is initialized.
    if (state.location?.lat === 0) {
      const currentZoom = map.getZoom();
      map.flyTo(value.location, currentZoom);
    }

    dispatch(setValuesAction(value));
  }, [value, dispatch, map, state.location]);

  return (
    <Wrapper>
      <StyledMap
        className={className}
        data-testid="map-input"
        events={{ click, dblclick: doubleClick }}
        hasZoomControls
        mapOptions={mapOptions}
        setInstance={setMap}
        {...otherProps}
      >
        <StyledViewerContainer
          topLeft={
            <StyledAutosuggest
              formatResponse={formatPDOKResponse}
              gemeentenaam="amsterdam"
              onClear={onClear}
              onSelect={onSelect}
              placeholder="Zoek adres"
              value={addressValue}
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

MapInput.propTypes = {
  className: PropTypes.string,
  /** leaflet options, See `https://leafletjs.com/reference-1.6.0.html#map-option` */
  mapOptions: PropTypes.shape({}).isRequired,
  /**
   * Callback handler that is fired when a click on the map is registered or when an option in the autosuggest
   * list is selected
   */
  onChange: PropTypes.func,
  value: PropTypes.shape({
    location: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
    addressText: PropTypes.string,
  }),
};

export default MapInput;
