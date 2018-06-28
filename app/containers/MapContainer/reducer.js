/*
 *
 * MapContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  GET_GEO,
  SET_GEO
} from './constants';

const initialState = fromJS({});

function mapContainerReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GEO:
      return state
        .set('isLoading', true);
    case SET_GEO:
      return state
        .set('location', action.location)
        .set('latlng', action.latlng)
        .set('isLoading', false);
    default:
      return state;
  }
}

export default mapContainerReducer;
