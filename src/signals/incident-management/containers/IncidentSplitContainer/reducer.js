import { fromJS } from 'immutable';
import {
  SPLIT_INCIDENT
} from './constants';

export const initialState = fromJS({
  id: null,
  loading: false,
  error: false
});

function incidentSplitContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SPLIT_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('id', action.payload);

    // case REQUEST_INCIDENT_SUCCESS:
    //   return state
    //     .set('incident', fromJS(action.payload))
    //     .set('error', false)
    //     .set('loading', false);

    // case REQUEST_INCIDENT_ERROR:
    //   return state
    //     .set('error', action.payload)
    //     .set('loading', false);

    default:
      return state;
  }
}

export default incidentSplitContainerReducer;
