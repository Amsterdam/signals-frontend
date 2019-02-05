import { fromJS } from 'immutable';
import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR
} from './constants';

import stadsdeelList from '../../definitions/stadsdeelList';
import priorityList from '../../definitions/priorityList';

export const initialState = fromJS({
  id: null,
  stadsdeelList,
  priorityList,
  loading: false,
  error: false
});

function incidentSplitContainerReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('id', action.payload)
        .set('incident', null);

    case REQUEST_INCIDENT_SUCCESS:
      return state
        .set('incident', fromJS(action.payload))
        .set('error', false)
        .set('loading', false);

    case REQUEST_INCIDENT_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);

    default:
      return state;
  }
}

export default incidentSplitContainerReducer;
