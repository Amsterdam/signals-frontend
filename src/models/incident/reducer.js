import { fromJS } from 'immutable';

import { stadsdeelList, priorityList, typesList } from 'signals/incident-management/definitions';
import statusList, {
  changeStatusOptionList,
  defaultTextsOptionList,
} from 'signals/incident-management/definitions/statusList';

import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR,
  PATCH_INCIDENT,
  PATCH_INCIDENT_SUCCESS,
  PATCH_INCIDENT_ERROR,
  DISMISS_ERROR,
  REQUEST_ATTACHMENTS,
  REQUEST_ATTACHMENTS_SUCCESS,
  REQUEST_ATTACHMENTS_ERROR,
  REQUEST_DEFAULT_TEXTS,
  REQUEST_DEFAULT_TEXTS_SUCCESS,
  REQUEST_DEFAULT_TEXTS_ERROR,
} from './constants';

export const initialState = fromJS({
  id: null,
  stadsdeelList,
  priorityList,
  changeStatusOptionList,
  defaultTextsOptionList,
  statusList,
  loading: false,
  error: false,
  attachments: [],
  typesList,
});

function incidentModelReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENT:
      return state.set('loading', true).set('error', false).set('id', action.payload).set('incident', null);

    case REQUEST_INCIDENT_SUCCESS:
      return state.set('incident', fromJS(action.payload)).set('error', false).set('loading', false);

    case REQUEST_INCIDENT_ERROR:
      return state.set('error', fromJS(action.payload)).set('loading', false);

    case PATCH_INCIDENT:
      return state.set('error', false);

    case PATCH_INCIDENT_SUCCESS:
      return state.set('incident', fromJS(action.payload.incident)).set('error', false);

    case PATCH_INCIDENT_ERROR:
      return state.set('error', fromJS(action.payload.error));

    case DISMISS_ERROR:
      return state.set('error', false);

    case REQUEST_ATTACHMENTS:
      return state.set('attachments', fromJS([]));

    case REQUEST_ATTACHMENTS_SUCCESS:
      return state.set('attachments', fromJS(action.payload));

    case REQUEST_ATTACHMENTS_ERROR:
      return state.set('attachments', fromJS([]));

    case REQUEST_DEFAULT_TEXTS:
      return state.set('defaultTexts', fromJS([]));

    case REQUEST_DEFAULT_TEXTS_SUCCESS:
      return state.set('defaultTexts', fromJS(action.payload));

    case REQUEST_DEFAULT_TEXTS_ERROR:
      return state.set('defaultTexts', fromJS([]));

    default:
      return state;
  }
}

export default incidentModelReducer;
