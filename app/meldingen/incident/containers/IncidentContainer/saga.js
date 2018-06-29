import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { CREATE_INCIDENT, GET_CLASSIFICATION } from './constants';
import {
  createIncidentSuccess,
  createIncidentError,
  getClassificationSuccess,
  getClassificationError
} from './actions';
import makeSelectIncidentContainer from './selectors';

export function* createIncident() {
  const requestURL = '/api/meldingen';

  try {
    const data = yield select(makeSelectIncidentContainer());
    console.log('data', data);
    const incident = yield call(request, requestURL);
    yield put(createIncidentSuccess(incident));
  } catch (err) {
    yield put(createIncidentError(err));
  }
}

export function* getClassification({ text }) {
  const requestURL = 'https://meldingen-classification.herokuapp.com/calls/';

  try {
    const classification = yield call(request, requestURL, {
      method: 'post',
      body: JSON.stringify({
        text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    yield put(getClassificationSuccess(classification));
  } catch (err) {
    yield put(getClassificationError(err));
  }
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield takeLatest(CREATE_INCIDENT, createIncident);
  yield takeLatest(GET_CLASSIFICATION, getClassification);
}
