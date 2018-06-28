/*
 *
 * MapContainer actions
 *
 */

import {
  GET_GEO,
  SET_GEO
} from './constants';

export function getGeoName(latlng) {
  return {
    type: GET_GEO,
    latlng
  };
}

export function setGeoName(name, latlng) {
  return {
    type: SET_GEO,
    location: name,
    latlng
  };
}
