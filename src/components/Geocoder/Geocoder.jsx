import React, { useEffect, useState, useCallback, useReducer } from 'react';
import PropTypes from 'prop-types';
import 'leaflet/dist/leaflet.css';
import { SearchBar } from '@datapunt/asc-ui';
import { useMapInstance, Marker, GeoJSON } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';
import mapLocation, { formatAddress } from 'shared/services/map-location';
import SearchResultsList from './SearchResultsList';
import {
  reducer,
  searchTermSelected,
  clearSearchResults,
  searchResultsChanged,
  resultSelected,
  searchTermChanged,
  initialState,
} from './ducks';
import GeocoderStyle from './GeocoderStyle';
import pointQuery from './services/pointQuery';
import ParksLayer, { getParksLayerOptions } from './ParksLayer';

const markerPosition = {
  lat: 52.3731081,
  lng: 4.8932945,
};

const inputProps = {
  autoCapitalize: 'off',
  autoComplete: 'off',
  autoCorrect: 'off',
};

const Geocoder = ({
  placeholder,
  getSuggestions,
  getAddressById,
  location: locationValue,
  onLocationChange,
  ...otherProps
}) => {
  const mapInstance = useMapInstance();
  const [marker, setMarker] = useState();
  const [{ term, results, index, searchMode }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [markerLocation, setMarkerLocation] = useState();

  const onSelect = async idx => {
    dispatch(searchTermSelected(results[idx].name));
    const { id } = results[idx];
    const { location } = await getAddressById(id);
    if (location) {
      setMarkerLocation(location);
    }
    dispatch(clearSearchResults());
  };

  useEffect(() => {
    if (!searchMode) return;
    if (index > -1) return;
    if (term.length < 3) {
      dispatch(clearSearchResults());
    } else {
      (async () => {
        const suggestions = await getSuggestions(term);
        dispatch(searchResultsChanged(suggestions));
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  useEffect(() => {
    if (!locationValue || !marker) return;
    const { location } = mapLocation(locationValue);
    marker.setLatLng(location);
    marker.setOpacity(1);

    dispatch(searchTermSelected(locationValue.address? formatAddress(locationValue.address) : ''));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationValue, marker]);

  const flyTo = useCallback(
    location => {
      if (mapInstance) {
        const currentZoom = mapInstance.getZoom();
        mapInstance.flyTo(location, currentZoom < 11 ? 11 : currentZoom);
        marker.setOpacity(1);
      }
    },
    [mapInstance, marker]
  );

  useEffect(() => {
    if (!markerLocation) return;
    marker.setLatLng(markerLocation);
    flyTo(markerLocation);
    setMarkerLocation(markerLocation);
  }, [flyTo, marker, markerLocation]);

  const handleKeyDown = async event => {
    switch (event.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        event.preventDefault();

        dispatch(resultSelected(index > -1 ? index - 1 : index));
        break;

      // Arrow down
      case 40:
        dispatch(
          resultSelected(index < results.length - 1 ? index + 1 : index)
        );
        break;

      // Escape
      case 27:
        dispatch(searchTermChanged(''));
        dispatch(clearSearchResults());
        marker.setOpacity(0);
        break;

      // Enter
      case 13:
        if (index > -1) {
          await onSelect(index);
        }
        break;

      default:
        break;
    }
  };

  const handleOnSubmit = async () => {
    if (results.length === 0) return;
    const idx = index === -1 ? 0 : index;
    onSelect(idx);
  };

  const handleOnChange = value => {
    dispatch(searchTermChanged(value));
    if (value === '') {
      marker.setOpacity(0);
    }
  };

  useEffect(() => {
    const clickHandler = async e => {
      const pointInfo = await pointQuery(e);
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
    <GeocoderStyle {...otherProps}>
      <SearchBar
        placeholder={placeholder}
        inputProps={inputProps}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        value={term}
      />
      <SearchResultsList items={results} selected={index} onSelect={onSelect} />
      <Marker
        setInstance={setMarker}
        args={[markerPosition]}
        options={{
          icon: markerIcon,
          opacity: 0,
        }}
      />
      <GeoJSON
        args={[ParksLayer]}
        options={getParksLayerOptions(onLocationChange)}
      />
    </GeocoderStyle>
  );
};

Geocoder.defaultProps = {
  placeholder: 'Zoek adres',
};

Geocoder.propTypes = {
  placeholder: PropTypes.string,
  getSuggestions: PropTypes.func.isRequired,
  getAddressById: PropTypes.func.isRequired,
  location: PropTypes.object,
  onLocationChange: PropTypes.func.isRequired,
};

export default Geocoder;
