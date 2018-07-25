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
  GET_CLASSIFICATION_ERROR,

  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

export const initialState = fromJS({
  incident: {
    // id: 666,
    // location: {
      // address: {
        // openbare_ruimte: 'Overtoom',
        // huisnummer: '403',
        // huisletter: '',
        // huisnummer_toevoeging: '3',
        // postcode: '1054JP',
        // woonplaats: 'Amsterdam'
      // },
      // buurt_code: 'E21b',
      // stadsdeel: 'E',
      // geometrie: {
        // type: 'Point',
        // coordinates: [
          // 52.359256308649634,
          // 4.8617282917985
        // ]
      // }
    // },
    // subcategory: 'Overlast op het water - snel varen',
    // category: 'Overlast op het water',
    // description: 'snel boot',
    // description: 'poep',
    // phone: '020654321',
    // email: 'a@b.com',
    // extra_boten_snelheid_rondvaartboot: 'Ja',
    // extra_boten_snelheid_rederij: 'Aemstelland',
    // datetime: 'Nu',

    incident_date: 'Vandaag',
    incident_time_hours: 9,
    incident_time_minutes: 0
  },
  upload: {}
});

function incidentContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INCIDENT:
      return state
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          ...action.incident
        }));

    case CREATE_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false);

    case CREATE_INCIDENT_SUCCESS:
      return state
        .set('loading', false)
        .set('incident', fromJS({
          id: action.incident.id,
          subcategory: state.get('incident').toJS().subcategory
        }));

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
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          ...action.payload
        }));

    case GET_CLASSIFICATION_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);

    case UPLOAD_REQUEST:
      return state;

    case UPLOAD_PROGRESS:
      return state;

    case UPLOAD_SUCCESS:
      return state;

    case UPLOAD_FAILURE:
      return state;

    default:
      return state;
  }
}

export default incidentContainerReducer;
