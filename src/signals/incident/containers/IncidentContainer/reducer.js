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

  // GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,

  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

export const initialState = fromJS({
  incident: {
    // location: {
    // address: {
    // openbare_ruimte: 'Wilhelminastraat',
    // huisnummer: 42,
    // huisletter: '',
    // huisnummer_toevoeging: '1',
    // postcode: '1054WJ',
    // woonplaats: 'Amsterdam'
    // },
    // buurt_code: 'E20c',
    // stadsdeel: 'E',
    // geometrie: {
    // type: 'Point',
    // coordinates: [
    // 52.36223071695314,
    // 4.865698814392091
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
          ...action.payload
        }));

    case CREATE_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false);

    case CREATE_INCIDENT_SUCCESS:
      return state
        .set('loading', false)
        .set('incident', fromJS({
          id: action.payload.id,
          category: action.payload.category.main,
          subcategory: action.payload.category.sub
        }));

    case CREATE_INCIDENT_ERROR:
      return state
        .set('error', true)
        .set('loading', false);

    // case GET_CLASSIFICATION:
      // return state
        // .set('loading', false)
        // .set('error', false);

    case GET_CLASSIFICATION_SUCCESS:
      return state
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          ...action.payload
        }));

    case GET_CLASSIFICATION_ERROR:
      return state
        .set('incident', fromJS({
          ...state.get('incident').toJS(),
          ...action.payload
        }));

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
