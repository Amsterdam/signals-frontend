import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { CREATE_INCIDENT } from './constants';
import { createIncidentSuccess, createIncidentError } from './actions';
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

// Individual exports for testing
export default function* watchSetIncidentSaga() {
  yield takeLatest(CREATE_INCIDENT, createIncident);
}
