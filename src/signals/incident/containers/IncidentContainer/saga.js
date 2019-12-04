import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { replace } from 'connected-react-router/immutable';

import { authPostCall, postCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { uploadRequest, showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR } from 'containers/Notification/constants';
import { makeSelectCategories } from 'containers/App/selectors';

import { CREATE_INCIDENT, GET_CLASSIFICATION, SET_PRIORITY } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError,
  setPriority,
  setPrioritySuccess,
  setPriorityError,
} from './actions';
import mapControlsToParams from '../../services/map-controls-to-params';
import setClassification from '../../services/set-classification';

export const PREDICTION_REQUEST_URL = `${CONFIGURATION.API_ROOT}signals/category/prediction`;
export const INCIDENT_REQUEST_URL = `${CONFIGURATION.API_ROOT}signals/signal/`;
export const PRIORITY_REQUEST_URL = `${CONFIGURATION.API_ROOT}signals/auth/priority/`;

export function* retryFetchClassification(text, msDelay = 1000) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 3; i++) {
    try {
      const apiResponse = yield call(postCall, PREDICTION_REQUEST_URL, {
        text,
      });

      return apiResponse;
    } catch (err) {
      /* istanbul ignore else */
      if (i <= 2) {
        yield delay(msDelay);
      }
    }
  }

  // attempts failed after 3 attempts
  throw new Error('API request failed');
}

export function* getClassification(action) {
  const categories = yield select(makeSelectCategories());

  try {
    const result = yield call(retryFetchClassification, action.payload);

    yield put(
      getClassificationSuccess(setClassification(result, categories.sub))
    );
  } catch (error) {
    yield put(
      getClassificationError(setClassification(undefined, categories.sub))
    );
  }
}

export function* createIncident(action) {
  try {
    const result = yield call(
      postCall,
      INCIDENT_REQUEST_URL,
      mapControlsToParams(action.payload.incident, action.payload.wizard)
    );

    if (
      action.payload.isAuthenticated &&
      action.payload.incident.priority.id === 'high'
    ) {
      yield put(
        setPriority({
          priority: action.payload.incident.priority.id,
          _signal: result.id,
        })
      );
    }

    if (action.payload.incident.images) {
      yield all(
        action.payload.incident.images.map(image =>
          put(
            uploadRequest({
              file: image,
              id: result.signal_id,
            })
          )
        )
      );
    }

    yield put(createIncidentSuccess(result));
  } catch (error) {
    yield put(createIncidentError());
    yield put(replace('/incident/fout'));
  }
}

export function* setPriorityHandler(action) {
  try {
    const result = yield call(
      authPostCall,
      PRIORITY_REQUEST_URL,
      action.payload
    );
    yield put(setPrioritySuccess(result));
  } catch (error) {
    yield put(setPriorityError());
    yield put(showGlobalNotification({ variant: VARIANT_ERROR, title: 'Het zetten van de urgentie van deze melding is niet gelukt' }));
  }
}

export default function* watchIncidentContainerSaga() {
  yield all([
    takeLatest(GET_CLASSIFICATION, getClassification),
    takeLatest(CREATE_INCIDENT, createIncident),
    takeLatest(SET_PRIORITY, setPriorityHandler),
  ]);
}
