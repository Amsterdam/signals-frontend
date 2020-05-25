import { all, call, put, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';

import request from 'utils/request';
import { postCall, authPostCall } from 'shared/services/api/api';
import configuration from 'shared/services/configuration/configuration';
import { uploadFile } from 'containers/App/saga';
import resolveClassification from 'shared/services/resolveClassification';
import resolveQuestions from 'shared/services/resolve-questions';
import mapControlsToParams from 'signals/incident/services/map-controls-to-params';
import { isAuthenticated } from 'shared/services/auth/auth';
import { CREATE_INCIDENT, GET_CLASSIFICATION, GET_QUESTIONS } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError,
  getQuestions,
  getQuestionsSuccess,
  getQuestionsError,
} from './actions';

export function* getClassification(action) {
  try {
    const result = yield call(postCall, configuration.PREDICTION_ENDPOINT, {
      text: action.payload,
    });

    const classification = yield call(resolveClassification, result);

    yield put(getClassificationSuccess(classification));
    yield put(getQuestions(classification));
  } catch (error) {
    const classification = yield call(resolveClassification);

    yield put(getClassificationError(classification));
  }
}

const fetchQuestions = () => ({
  _links: {},
  count: 2,
  results: [
    {
      field_type: 'CHECKBOX',
      key: 'extra_bedrijven_horeca_personen',
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        label: 'Wat is de oorzaak van de overlast?',
        labelShort: 'Oorzaak overlast',
        values: {
          dronken_bezoekers: 'Dronken bezoekers',
          schreeuwende_bezoekers: 'Schreeuwende bezoekers',
          rokende_bezoekers: 'Rokende bezoekers',
          teveel_fietsen: '(Teveel) fietsen',
          wildplassen: 'Wildplassen',
          overgeven: 'Overgeven',
        },
      },
    },
    {
      field_type: 'RADIO_GROUP',
      key: 'extra_bedrijven_horeca_wat',
      meta: {
        ifAllOf: {
          category: 'overlast-bedrijven-en-horeca',
        },
        label: 'Uw melding gaat over:',
        labelShort: 'Soort bedrijf',
        values: {
          horecabedrijf: 'Horecabedrijf, zoals een café, restaurant, snackbar of kantine',
          ander_soort_bedrijf: 'Ander soort bedrijf, zoals een winkel, supermarkt of sportschool',
          evenement_festival_markt: 'Evenement, zoals een festival, feest of markt',
          iets_anders: 'Iets anders',
        },
      },
      options: { validators: ['REQUIRED'] },
    },
  ],
});

export function* getQuestionsHandler(action) {
  try {
    const { results: rawQuestions } = yield call(fetchQuestions, action.payload);
    const questions = yield call(resolveQuestions, rawQuestions);

    yield put(getQuestionsSuccess({ questions }));
  } catch (error) {
    yield put(getQuestionsError());
  }
}

export function* createIncident(action) {
  try {
    const { handling_message, ...postData } = yield call(getPostData, action);

    const postResult = yield call(postIncident, postData);

    const incident = { ...postResult, handling_message };

    if (action.payload.incident.images) {
      // perform blocking requests for image uploads
      yield all([
        ...action.payload.incident.images.map(image =>
          call(uploadFile, {
            payload: {
              file: image,
              id: incident.signal_id,
            },
          })
        ),
      ]);
    }

    yield put(createIncidentSuccess(incident));
  } catch (error) {
    yield put(createIncidentError());
    yield put(replace('/incident/fout'));
  }
}

/**
 * Perform a POST request to either the public or the private endpoint
 *
 * @param {Object} postData
 * @returns {Object} The post response, containing the newly created incident
 */
export function* postIncident(postData) {
  if (isAuthenticated()) {
    return yield call(authPostCall, configuration.INCIDENT_PRIVATE_ENDPOINT, postData);
  }

  return yield call(postCall, configuration.INCIDENT_PUBLIC_ENDPOINT, postData);
}

/**
 * Return data that has been collected by the incident form, enriched with information that the API
 * requires (subcategory), potentially filtered based by the condition if the current user has been
 * authenticated.
 *
 * @param {Object} action - Action object passed on by the createIncident saga
 * @returns {Object}
 */
export function* getPostData(action) {
  const { category, subcategory } = action.payload.incident;

  const {
    handling_message,
    _links: {
      self: { href: sub_category },
    },
  } = yield call(request, `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`);

  const controlsToParams = yield call(mapControlsToParams, action.payload.incident, action.payload.wizard);

  const primedPostData = {
    ...action.payload.incident,
    ...controlsToParams,
    category: {
      sub_category,
    },
    // the priority prop needs to be a nested value 🤷
    priority: {
      priority: action.payload.incident.priority.id,
    },
    type: {
      code: action.payload.incident.type.id,
    },
    handling_message,
  };

  const validFields = [
    'category',
    'extra_properties',
    'handling_message',
    'incident_date_end',
    'incident_date_start',
    'location',
    'priority',
    'reporter',
    'source',
    'text_extra',
    'text',
    'type',
  ];
  const authenticatedOnlyFields = ['priority', 'source', 'type'];

  // function to filter out values that are not supported by the public API endpoint
  const filterSupportedFields = ([key]) =>
    isAuthenticated() || (!isAuthenticated() && !authenticatedOnlyFields.includes(key));

  const filterValidFields = ([key]) => validFields.includes(key);

  // return the filtered post data
  return Object.entries(primedPostData)
    .filter(filterValidFields)
    .filter(filterSupportedFields)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(GET_QUESTIONS, getQuestionsHandler),
    takeLatest(CREATE_INCIDENT, createIncident),
  ]);
}
