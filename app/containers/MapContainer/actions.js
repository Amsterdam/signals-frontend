import {
  GET_GEO,
  SET_GEO
} from './constants';

export function getGeoName(latlng) {
  return {
    type: GET_GEO,
    payload: latlng
  };
}

export function setGeoName({ location, latlng }) {
  return {
    type: SET_GEO,
    payload: {
      location,
      latlng
    }
  };
}
