/*
 *
 * IncidentDetailPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR
} from './constants';

import { REQUEST_CATEGORY_UPDATE_SUCCESS } from '../IncidentCategoryContainer/constants';
import { REQUEST_STATUS_CREATE_SUCCESS } from '../IncidentStatusContainer/constants';

export const initialState = fromJS({ id: null });

function incidentDetailPageReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('id', action.payload);
    case REQUEST_INCIDENT_SUCCESS:
      return state
        .set('incident', action.payload)
        .set('loading', false);
    case REQUEST_INCIDENT_ERROR:
      return state
        .set('error', action.payload)
        .set('loading', false);

    case REQUEST_CATEGORY_UPDATE_SUCCESS:
      return state
        .set('incident', { ...state.get('incident'), category: action.payload });
    case REQUEST_STATUS_CREATE_SUCCESS:
      return state
        .set('incident', { ...state.get('incident'), status: action.payload });

    default:
      return state;
  }
}

export default incidentDetailPageReducer;
