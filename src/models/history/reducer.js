import { fromJS } from 'immutable';
import {
  REQUEST_HISTORY_LIST,
  REQUEST_HISTORY_LIST_SUCCESS,
  REQUEST_HISTORY_LIST_ERROR,
}
  from './constants';

export const initialState = fromJS({
  list: [],
  loading: false,
});

function historyReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_HISTORY_LIST:
      return state
        .set('list', fromJS([]))
        .set('loading', true)
        .set('error', false);

    case REQUEST_HISTORY_LIST_SUCCESS:
      return state
        .set('list', fromJS(action.payload))
        .set('loading', false);

    case REQUEST_HISTORY_LIST_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default historyReducer;
