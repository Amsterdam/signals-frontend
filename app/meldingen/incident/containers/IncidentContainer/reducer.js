/*
 *
 * IncidentContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_INCIDENT,
  SEND_INCIDENT,
  SEND_INCIDENT_SUCCESS,
  SEND_INCIDENT_ERROR
} from './constants';

const initialState = fromJS({
  incident: {}
});

function incidentContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INCIDENT:
      return state
        .set('loading', false)
        .set('error', false)
        .set('incident', {
          ...state.get('incident'),
          ...action.incident
        });

    case SEND_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incident', []);

    case SEND_INCIDENT_SUCCESS:
      return state
        .set('incidents', action.incident)
        .set('loading', false);

    case SEND_INCIDENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    default:
      return state;
  }
}

export default incidentContainerReducer;
