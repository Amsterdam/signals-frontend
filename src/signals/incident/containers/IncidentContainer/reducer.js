import { fromJS, Seq } from 'immutable';
import {
  UPDATE_INCIDENT,
  RESET_INCIDENT,
  CREATE_INCIDENT,
  CREATE_INCIDENT_SUCCESS,
  CREATE_INCIDENT_ERROR,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_SUCCESS,
  GET_CLASSIFICATION_ERROR,
  RESET_EXTRA_STATE,
  GET_QUESTIONS,
  GET_QUESTIONS_SUCCESS,
  GET_QUESTIONS_ERROR,
} from './constants';

export const initialState = fromJS({
  incident: {
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
    questions: [],
    source: undefined,
    subcategory: '',
    type: {
      id: 'SIG',
      label: 'Melding',
    },
  },
  loadingClassification: false,
  loadingQuestions: false,
});

const getIncidentWithoutExtraProps = (incident, { category, subcategory } = {}) => {
  const prevCategory = incident.get('category');
  const prevSubcategory = incident.get('subcategory');
  const hasChanged = prevCategory !== category || prevSubcategory !== subcategory;

  if (!hasChanged && category && subcategory) return incident;

  const seq = Seq(incident).filter((val, key) => !key.startsWith('extra'));

  return seq.toMap();
};

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
        getIncidentWithoutExtraProps(state.get('incident'), action.payload)
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

    case RESET_EXTRA_STATE:
      return state.set('incident', getIncidentWithoutExtraProps(state.get('incident'), action.payload));

    case GET_QUESTIONS:
      return state.set('loadingQuestions', true);

    case GET_QUESTIONS_SUCCESS:
      return state
        .set('loadingQuestions', false)
        .set('incident', state.get('incident').set('questions', action.payload.questions));

    case GET_QUESTIONS_ERROR:
      return state.set('loadingQuestions', false);

    default:
      return state;
  }
};
