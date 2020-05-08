import React, { useLayoutEffect, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import styled from '@datapunt/asc-core';
import { Marker } from '@datapunt/react-maps';
import { ViewerContainer } from '@datapunt/asc-ui';
import 'leaflet/dist/leaflet.css';

import { markerIcon } from 'shared/services/configuration/map-markers';
import { locationTofeature, formatPDOKResponse } from 'shared/services/map-location';
import MapContext from 'containers/MapContext/context';
import { setLocationAction, setValuesAction, resetLocationAction } from 'containers/MapContext/actions';
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

const MapInput = ({ className, value, onChange, mapOptions, events }) => {
  const { state, dispatch } = useContext(MapContext);
  const [map, setMap] = useState();
  const [marker, setMarker] = useState();
  const { location, addressText: addressValue } = state;
  const hasLocation = Boolean(location) && location?.lat !== 0 && location?.lng !== 0;

  /**
   * This reference ensures the map zooms to the marker location only when the marker location
   * is provided from the parent and not on click action
   */
  const hasInitalViewRef = useRef(true);

  const clickFunc = useCallback(
    async event => {
      hasInitalViewRef.current = false;
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

      map.flyTo(option.data.location);
    },
    [map, dispatch, onChange]
  );

  const { click, doubleClick } = useDelayedDoubleClick(clickFunc);

  /**
   * Subscribe to value prop changes
   */
  useEffect(() => {
    // first component render has an empty object for `value` so we need to check for props
    if (Object.keys(value).length === 0) return;

    dispatch(setValuesAction(value));
  }, [value, dispatch]);

  // subscribe to changes in location and render the map in that location
  // note that we're using setView instead of flyTo on the map instance to prevent remounts of this component
  // to show an animation instead of just rendering the marker on the location where it should be
  useLayoutEffect(() => {
    if (!map || !marker || !hasLocation) return;

    if (hasInitalViewRef.current) {
      const zoomLevel = map.getZoom();
      map.setView(location, zoomLevel < 11 ? 11 : zoomLevel);
      hasInitalViewRef.current = false;
    }

    marker.setLatLng(location);
  }, [marker, location, hasLocation, map]);

  return (
    <Wrapper data-testid="map-input" className={className}>
      <StyledMap
        events={{ click, dblclick: doubleClick, ...events }}
        hasZoomControls
        mapOptions={mapOptions}
        setInstance={setMap}
      >
        <StyledViewerContainer
          topLeft={
            <StyledAutosuggest
              formatResponse={formatPDOKResponse}
              gemeentenaam="amsterdam"
              onClear={() => dispatch(resetLocationAction())}
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
  /** @ignore */
  className: PropTypes.string,
  /**
   * Leaflet map events
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-event}
   */
  events: PropTypes.shape({}),
  /**
   * leaflet options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
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
    address: PropTypes.shape({
      huisnummer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      openbare_ruimte: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
  }),
};

export default MapInput;
