import { fromJS } from 'immutable';
import {
  REQUEST_STATUS_LIST, REQUEST_STATUS_LIST_SUCCESS, REQUEST_STATUS_LIST_ERROR,
  REQUEST_STATUS_CREATE, REQUEST_STATUS_CREATE_SUCCESS, REQUEST_STATUS_CREATE_ERROR
}
  from './constants';
import statusList from '../../definitions/statusList';

export const initialState = fromJS({
  incidentStatusList: [],
  statusList,
  loading: false
});

function incidentStatusContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_STATUS_LIST:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_STATUS_LIST_SUCCESS:
      return state
        .set('incidentStatusList', action.payload.results)
        .set('loading', false);
    case REQUEST_STATUS_CREATE:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_STATUS_CREATE_SUCCESS:
      return state
        .set('incidentStatusList', fromJS([...state.get('incidentStatusList'), action.payload]))
        .set('loading', false);

    case REQUEST_STATUS_LIST_ERROR:
    case REQUEST_STATUS_CREATE_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default incidentStatusContainerReducer;
