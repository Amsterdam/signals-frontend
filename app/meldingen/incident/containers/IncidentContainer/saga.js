import { call, put, /* select, */ takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError
} from './actions';
// import makeSelectIncidentContainer from './selectors';

export function* createIncident(incident) {
  const requestURL = 'api/signals/signal';

  try {
    const result = yield call(request, requestURL, {
      method: 'post',
      body: JSON.stringify(incident),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    yield put(createIncidentSuccess(result));
  } catch (err) {
    yield put(createIncidentError(err));
  }
}

export function* getClassification({ text }) {
  const requestURL = 'https://meldingen-classification.herokuapp.com/calls/';

  try {
    const result = yield call(request, requestURL, {
      method: 'post',
      body: JSON.stringify({
        text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    yield put(getClassificationSuccess(result));
  } catch (err) {
    yield put(getClassificationError(err));
  }
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield [
    yield takeLatest(CREATE_INCIDENT, createIncident),
    yield takeLatest(GET_CLASSIFICATION, getClassification)
  ];
}
