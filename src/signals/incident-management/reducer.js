import { fromJS } from 'immutable';
import priorityList from './definitions/priorityList';
import stadsdeelList from './definitions/stadsdeelList';
import statusList from './definitions/statusList';
import feedbackList from './definitions/feedbackList';

import {
  GET_FILTERS_SUCCESS,
  GET_FILTERS_FAILED,
  REMOVE_FILTER_SUCCESS,
  APPLY_FILTER,
} from './constants';

export const initialState = fromJS({
  priorityList,
  stadsdeelList,
  statusList,
  feedbackList,
  allFilters: [],
  filter: {},
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

    default:
      return state;
  }
};
