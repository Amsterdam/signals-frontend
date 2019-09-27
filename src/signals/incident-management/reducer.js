import { fromJS } from 'immutable';

import priority from './definitions/priorityList';
import stadsdeel from './definitions/stadsdeelList';
import status from './definitions/statusList';
import feedback from './definitions/feedbackList';

import {
  APPLY_FILTER,
  CLEAR_FILTER_FAILED,
  CLEAR_FILTER,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  REMOVE_FILTER_SUCCESS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
} from './constants';

export const initialState = fromJS({
  priority,
  stadsdeel,
  status,
  feedback,
  allFilters: [],
  filter: undefined,
});

export default (state = initialState, action) => {
  let newFilters;
  let re;

  switch (action.type) {
    case GET_FILTERS_SUCCESS:
      return state
        .set('allFilters', fromJS(action.payload))
        .set('loading', false);

    case GET_FILTERS_FAILED:
      return state
        .set('loading', false)
        .set('error', true)
        .set('errorMessage', action.payload);

    case REMOVE_FILTER_SUCCESS:
      re = new RegExp(`/${action.payload}`, 'g');
      newFilters = state
        .get('allFilters')
        .toJS()
        .filter((i) => !i._links.self.href.match(re));
      return state.set('allFilters', fromJS(newFilters));

    case APPLY_FILTER:
      return state.set('filter', fromJS(action.payload));

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
        .set('filter', fromJS(action.payload))
        .set('error', false)
        .set('errorMessage', undefined)
        .set('loading', false);

    default:
      return state;
  }
};
