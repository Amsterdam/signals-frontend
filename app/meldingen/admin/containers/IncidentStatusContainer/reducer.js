import { fromJS } from 'immutable';
import {
  REQUEST_STATUS_LIST, REQUEST_STATUS_LIST_SUCCESS, REQUEST_STATUS_LIST_ERROR,
  REQUEST_STATUS_ADD, REQUEST_STATUS_ADD_SUCCESS, REQUEST_STATUS_ADD_ERROR
}
  from './constants';
import statusList from '../../definitions/statusList';

const initialState = fromJS({
  incidentStatusList: [],
  statusList
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
    case REQUEST_STATUS_ADD:
      return state
        .set('loading', true)
        .set('error', false);
    case REQUEST_STATUS_ADD_SUCCESS:
      return state
        .set('incidentStatusList', fromJS([...state.get('incidentStatusList'), action.payload]))
        .set('loading', false);

    case REQUEST_STATUS_LIST_ERROR:
    case REQUEST_STATUS_ADD_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);
    default:
      return state;
  }
}

export default incidentStatusContainerReducer;
