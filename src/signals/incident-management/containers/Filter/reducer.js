import { fromJS } from 'immutable';

import {
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  CLEAR_FILTER,
  CLEAR_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILED,
} from './constants';

export const initialState = fromJS({
  activeFilter: {},
  loading: false,
  error: false,
  errorMessage: '',
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_FILTER_FAILED:
    case UPDATE_FILTER_FAILED:
    case CLEAR_FILTER_FAILED:
      return state
        .set('loading', false)
        .set('error', true)
        .set('errorMessage', action.payload);

    case SAVE_FILTER_SUCCESS:
    case UPDATE_FILTER_SUCCESS:
    case CLEAR_FILTER:
      return state
        .set('activeFilter', fromJS(action.payload))
        .set('loading', false);

    default:
      return state;
  }
};
