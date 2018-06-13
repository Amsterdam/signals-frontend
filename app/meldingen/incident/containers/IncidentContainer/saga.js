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
    const { filter } = yield select(makeSelectIncidentContainer());
    const incidents = yield call(request, requestURL, filter);
    yield put(createIncidentSuccess(incidents));
  } catch (err) {
    yield put(createIncidentError(err));
  }
}

export function* getClassification() {
  const requestURL = 'http://meldingen-classification.herokuapp.com';

  try {
    const { filter } = yield select(makeSelectIncidentContainer());
    const incidents = yield call(request, requestURL, filter);
    yield put(getClassificationSuccess(incidents));
  } catch (err) {
    yield put(getClassificationError(err));
  }
}

// Individual exports for testing
export default function* watchIncidentContainerSaga() {
  yield takeLatest(CREATE_INCIDENT, createIncident);
  yield takeLatest(GET_CLASSIFICATION, getClassification);
}
