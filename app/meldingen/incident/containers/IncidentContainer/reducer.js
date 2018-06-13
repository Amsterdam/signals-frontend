/*
 *
 * IncidentContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR
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

    case CREATE_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incident', []);

    case CREATE_INCIDENT_SUCCESS:
      return state
        .set('incidents', action.incident)
        .set('loading', false);

    case CREATE_INCIDENT_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case GET_CLASSIFICATION:
      return state
        .set('loading', false)
        .set('error', false);

    case GET_CLASSIFICATION_SUCCESS:
      return state
        .set('incident', {
          ...state.get('incident'),
          category: action.hoofdrubriek[0][0],
          categoryChance: action.hoofdrubriek[1][0],
          subcategory: action.subrubriek[0][0],
          subcategoryChance: action.subrubriek[1][0]
        });

    case GET_CLASSIFICATION_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    default:
      return state;
  }
}

export default incidentContainerReducer;
