import { fromJS } from 'immutable';

import {
  SAVE_FILTER,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
} from './constants';

export const initialState = fromJS({
  activeFilter: {},
  loading: false,
  error: false,
  errorMessage: '',
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_FILTER:
      return state.set('loading', true).set('error', false);

    case SAVE_FILTER_FAILED:
      return state
        .set('loading', false)
        .set('error', true)
        .set('errorMessage', action.payload);

    case SAVE_FILTER_SUCCESS:
      return state.set('activeFilter', fromJS(action.payload)).set('loading', false);

    default:
      return state;
  }
};
