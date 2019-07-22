import produce from 'immer';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList, { changeStatusOptionList } from 'signals/incident-management/definitions/statusList';

import {
  SPLIT_INCIDENT_SUCCESS,
  SPLIT_INCIDENT_ERROR,
} from 'signals/incident-management/containers/IncidentSplitContainer/constants';

import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR,
  DISMISS_SPLIT_NOTIFICATION,
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

export const initialState = {
  id: null,
  stadsdeelList,
  priorityList,
  changeStatusOptionList,
  statusList,
  loading: false,
  error: false,
  attachments: [],
  patching: {
    location: false,
    notes: false,
    priority: false,
    status: false,
    subcategory: false,
  },
  split: false,
};

/* eslint-disable default-case, no-param-reassign */
export default (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_INCIDENT:
        draft.loading = true;
        draft.error = false;
        draft.id = action.payload;
        draft.incident = null;
        break;

      case REQUEST_INCIDENT_SUCCESS:
        draft.incident = action.payload;
        draft.error = false;
        draft.loading = false;
        break;

      case REQUEST_INCIDENT_ERROR:
        draft.error = action.payload;
        draft.loading = false;
        break;

      case DISMISS_SPLIT_NOTIFICATION:
        draft.split = false;
        break;

      case PATCH_INCIDENT:
        draft.patching = {
          ...state.patching,
          [action.payload.type]: true,
        };
        draft.error = false;
        break;

      case PATCH_INCIDENT_SUCCESS:
        draft.incident = action.payload.incident;
        draft.patching = {
          ...state.patching,
          [action.payload.type]: false,
        };
        draft.error = false;
        break;

      case PATCH_INCIDENT_ERROR:
        draft.patching = {
          ...state.patching,
          [action.payload.type]: false,
        };
        draft.error = action.payload.error;
        break;

      case DISMISS_ERROR:
        draft.error = false;
        break;

      case REQUEST_ATTACHMENTS:
        draft.attachments = [];
        break;

      case REQUEST_ATTACHMENTS_SUCCESS:
        draft.attachments = action.payload;
        break;

      case REQUEST_ATTACHMENTS_ERROR:
        draft.attachments = [];
        break;

      case REQUEST_DEFAULT_TEXTS:
        draft.defaultTexts = [];
        break;

      case REQUEST_DEFAULT_TEXTS_SUCCESS:
        draft.defaultTexts = action.payload;
        break;

      case REQUEST_DEFAULT_TEXTS_ERROR:
        draft.defaultTexts = [];
        break;

      case SPLIT_INCIDENT_SUCCESS:
      case SPLIT_INCIDENT_ERROR:
        draft.split = action.payload;
        break;
    }
  });
