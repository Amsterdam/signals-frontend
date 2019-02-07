import { fromJS } from 'immutable';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';

import { REQUEST_PRIORITY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentPriorityContainer/constants';
import { REQUEST_CATEGORY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentCategoryContainer/constants';
import { REQUEST_STATUS_CREATE_SUCCESS } from 'signals/incident-management/containers/IncidentStatusContainer/constants';
import { REQUEST_NOTE_CREATE_SUCCESS } from 'signals/incident-management/containers/IncidentNotesContainer/constants';

import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR
} from './constants';

export const initialState = fromJS({
  id: null,
  stadsdeelList,
  priorityList,
  loading: false,
  error: false
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
        .set('error', action.payload)
        .set('loading', false);

    case REQUEST_CATEGORY_UPDATE_SUCCESS:
      return state
        .set('incident', fromJS({ ...state.get('incident').toJS(), category: action.payload }));

    case REQUEST_PRIORITY_UPDATE_SUCCESS:
      return state
        .set('incident', fromJS({ ...state.get('incident').toJS(), priority: action.payload }));

    case REQUEST_STATUS_CREATE_SUCCESS:
      return state
        .set('incident', fromJS({ ...state.get('incident').toJS(), status: action.payload }));

    case REQUEST_NOTE_CREATE_SUCCESS:
      return state
        .set('incidentNotesList', fromJS([action.payload, ...state.get('incidentNotesList').toJS()]))
        .set('incident', fromJS({ ...state.get('incident').toJS(), notes_count: state.get('incident').toJS().notes_count + 1 }));

    default:
      return state;
  }
}

export default incidentModelReducer;
