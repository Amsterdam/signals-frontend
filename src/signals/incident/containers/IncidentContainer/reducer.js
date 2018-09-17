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
  SET_PRIORITY_SUCCESS
} from './constants';

export const initialState = fromJS({
  incident: {
    location: {
      address: {
        openbare_ruimte: 'Diemerparklaan',
        huisnummer: '16',
        huisletter: '',
        huisnummer_toevoeging: '',
        postcode: '1087GE',
        woonplaats: 'Amsterdam'
      },
      buurt_code: 'M35c',
      stadsdeel: 'M',
      geometrie: {
        type: 'Point',
        coordinates: [
          4.995174407958985,
          52.35451699670258
        ]
      }
    },
    subcategory: 'Overlast op het water - snel varen',
    category: 'Overlast op het water',
    description: 'snel boot',
    phone: '020654321',
    email: 'a@b.com',
    extra_boten_snelheid_rondvaartboot: 'Ja',
    extra_boten_snelheid_rederij: 'Aemstelland',
    datetime: 'Nu',

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
      return state
        .set('priority', fromJS({}));

    default:
      return state;
  }
}

export default incidentContainerReducer;
