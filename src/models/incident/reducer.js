import { fromJS } from 'immutable';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';

import { SPLIT_INCIDENT_SUCCESS, SPLIT_INCIDENT_ERROR } from 'signals/incident-management/containers/IncidentSplitContainer/constants';

import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  DISMISS_SPLIT_NOTIFICATION,
  PATCH_INCIDENT, PATCH_INCIDENT_SUCCESS, PATCH_INCIDENT_ERROR
} from './constants';

export const initialState = fromJS({
  id: null,
  stadsdeelList,
  priorityList,
  loading: false,
  error: false,
  patching: {
    location: false
  },
  split: false
});

function incidentModelReducer(state = initialState, action) {
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
        .set('error', fromJS(action.payload))
        .set('loading', false);

    case DISMISS_SPLIT_NOTIFICATION:
      return state
        .set('split', false);

    case PATCH_INCIDENT:
      return state
        .set('patching', fromJS({
          ...state.get('patching').toJS(),
          [action.payload.type]: true
        }))
        .set('error', false);

    case PATCH_INCIDENT_SUCCESS:
      return state
        .set('incident', fromJS(action.payload.incident))
        .set('patching', fromJS({
          ...state.get('patching').toJS(),
          [action.payload.type]: false
        }))
        .set('error', false);

    case PATCH_INCIDENT_ERROR:
      return state
        .set('patching', fromJS({
          ...state.get('patching').toJS(),
          [action.payload.type]: false
        }))
        .set('error', fromJS(action.payload.error));

    case SPLIT_INCIDENT_SUCCESS:
    case SPLIT_INCIDENT_ERROR:
      return state
        .set('split', action.payload);

    default:
      return state;
  }
}

export default incidentModelReducer;
