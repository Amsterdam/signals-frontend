import { fromJS } from 'immutable';
import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
} from './constants';

export const initialState = fromJS({
  incident: {
    custom_text: '',
    datetime: undefined,
    incident_date: 'Vandaag',
    incident_time_hours: 9,
    incident_time_minutes: 0,
    category: '',
    description: '',
    email: '',
    handling_message: '',
    images_errors: [],
    images_previews: [],
    images: [],
    location: undefined,
    phone: undefined,
    priority: {
      id: 'normal',
      label: 'Normaal',
    },
    source: undefined,
    subcategory: '',
    type: {
      id: 'SIG',
      label: 'Melding',
    },
  },
  loadingClassification: false,
});

const getIncidentWithoutExtraProps = incident =>
  fromJS(
    Object.entries(incident.toJS()).reduce((acc, [key, val]) => {
      const keyVal = { [key]: val };
      const value = key.startsWith('extra') ? {} : keyVal;
      return { ...acc, ...value };
    }, {})
  );

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_INCIDENT:
      return state.set(
        'incident',
        fromJS({
          ...state.get('incident').toJS(),
          ...action.payload,
        })
      );

    case RESET_INCIDENT:
      return initialState;

    case CREATE_INCIDENT:
      return state
        .set('loading', true)
        .set('error', false)
        .set('incident', state.get('incident').set('id', null));

    case CREATE_INCIDENT_SUCCESS:
      return state.set('loading', false).set('incident', fromJS(action.payload));

    case CREATE_INCIDENT_ERROR:
      return state.set('error', true).set('loading', false);

    case GET_CLASSIFICATION:
      return state.set('loadingClassification', true);

    case GET_CLASSIFICATION_SUCCESS:
      return state.set('loadingClassification', false).set(
        'incident',
        getIncidentWithoutExtraProps(state.get('incident'))
          .set('category', action.payload.category)
          .set('subcategory', action.payload.subcategory)
      );

    case GET_CLASSIFICATION_ERROR:
      return state.set('loadingClassification', false).set(
        'incident',
        state
          .get('incident')
          .set('category', action.payload.category)
          .set('subcategory', action.payload.subcategory)
      );

    default:
      return state;
  }
};
