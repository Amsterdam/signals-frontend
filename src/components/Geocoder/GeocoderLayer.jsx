/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from '@datapunt/react-maps';
import { getParksLayerOptions } from './ParksLayer';
import { useGeocoderContext } from './GeocoderContext';

const GeocoderLayer = ({ data }) => {
  const { onLocationChange } = useGeocoderContext();
  return (
    <GeoJSON args={[data]} options={getParksLayerOptions(onLocationChange)} />
  );
};

GeocoderLayer.propTypes = {
  data: PropTypes.shape({}),
};

export default GeocoderLayer;
