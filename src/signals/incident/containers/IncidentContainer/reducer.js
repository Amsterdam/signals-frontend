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

  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,

  SET_PRIORITY,
  SET_PRIORITY_SUCCESS,
  SET_PRIORITY_ERROR
} from './constants';
// import debugInitialState from './debug/initialState';

export const initialState = fromJS({
  incident: {
    // ...debugInitialState,

    incident_date: 'Vandaag',
    incident_time_hours: 9,
    incident_time_minutes: 0,
    priority: 'normal'
  },
  priority: {}
});

function incidentContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INCIDENT:
      return state
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          ...action.payload
        }));

    case CREATE_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          id: null
        }));

    case CREATE_INCIDENT_SUCCESS:
      return state
        .set('loading', false)
        .set('incident', fromJS({
          ...(initialState.get('incident').toJS()),
          id: action.payload.id,
          category: action.payload.category.main,
          subcategory: action.payload.category.sub
        }));

    case CREATE_INCIDENT_ERROR:
      return state
        .set('error', true)
        .set('loading', false);

    case GET_CLASSIFICATION_SUCCESS:
    case GET_CLASSIFICATION_ERROR:
      return state
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          ...action.payload
        }));

    case SET_PRIORITY:
      return state
        .set('priority', fromJS({
          ...action.payload
        }));

    case SET_PRIORITY_SUCCESS:
    case SET_PRIORITY_ERROR:
      return state
        .set('priority', fromJS({}));

    default:
      return state;
  }
}

export default incidentContainerReducer;
