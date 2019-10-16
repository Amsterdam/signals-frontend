import { fromJS } from 'immutable';
import {
  SPLIT_INCIDENT,
  SPLIT_INCIDENT_SUCCESS,
  SPLIT_INCIDENT_ERROR,
} from './constants';

export const initialState = fromJS({
  split: false,
  loading: false,
  error: false,
});

function incidentSplitContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SPLIT_INCIDENT:
      return state
        .set('loading', true);

    case SPLIT_INCIDENT_SUCCESS:
      return state
        .set('split', fromJS(action.payload))
        .set('loading', false);

    case SPLIT_INCIDENT_ERROR:
      return state
        .set('error', fromJS(action.payload))
        .set('split', fromJS(action.payload))
        .set('loading', false);

    default:
      return state;
  }
}

export default incidentSplitContainerReducer;
