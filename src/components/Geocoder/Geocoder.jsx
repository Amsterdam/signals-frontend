/* eslint-disable react/prop-types */
import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from '@datapunt/react-maps';
import { reducer, initialState } from './ducks';
import GeocoderStyle from './GeocoderStyle';
import pointQuery from './services/pointQuery';
import ParksLayer, { getParksLayerOptions } from './ParksLayer';
import { getSuggestions, getAddressById } from './services/api';
import GeocoderMarker from './GeocoderMarker';
import GeocoderBar from './GeocoderBar';
import { GeocoderContext, useGeocoderContext } from './GeocoderContext';

const GeocoderWrapper = ({
  location,
  onLocationChange,
  children,
  ...otherProps
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  });
  return (
    <GeocoderContext.Provider
      value={{ state, dispatch, location, onLocationChange }}
    >
      <GeocoderStyle {...otherProps}>{children}</GeocoderStyle>;
    </GeocoderContext.Provider>
  );
};

const GeocoderLayer = ({ data }) => {
  const { onLocationChange } = useGeocoderContext();
  return (
    <GeoJSON args={[data]} options={getParksLayerOptions(onLocationChange)} />
  );
};

const Geocoder = ({ location, onLocationChange }) => (
  <GeocoderWrapper location={location} onLocationChange={onLocationChange}>
    <GeocoderBar
      getSuggestions={getSuggestions}
      getAddressById={getAddressById}
    ></GeocoderBar>
    <GeocoderMarker pointQueryService={pointQuery}>
      <GeocoderLayer data={ParksLayer} />
    </GeocoderMarker>
  </GeocoderWrapper>
);

GeocoderWrapper.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default Geocoder;
