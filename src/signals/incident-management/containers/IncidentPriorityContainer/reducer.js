import { fromJS } from 'immutable';
import {
  REQUEST_PRIORITY_UPDATE, REQUEST_PRIORITY_UPDATE_SUCCESS, REQUEST_PRIORITY_UPDATE_ERROR
}
  from './constants';
import priorityList from '../../definitions/priorityList';

export const initialState = fromJS({
  priorityList,
  loading: false,
  error: false
});

function incidentStatusContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_PRIORITY_UPDATE:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_PRIORITY_UPDATE_SUCCESS:
      return state
        .set('loading', false);

    case REQUEST_PRIORITY_UPDATE_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default incidentStatusContainerReducer;
