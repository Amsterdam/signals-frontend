import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from 'utils/request';

import { REQUEST_INCIDENT } from './constants';
import { requestIncidentSuccess, requestIncidentError } from './actions';
export function* fetchIncident(action) {
  const requestURL = '/api/signal';

  try {
    const { id } = action;
    // console.log(`requested incident id: ${id}`);
    const incident = yield call(request, `${requestURL}/${id}`);
    yield call(delay, 1000);
    yield put(requestIncidentSuccess(incident));
  } catch (err) {
    yield put(requestIncidentError(err));
  }
}

// Individual exports for testing
export default function* watchRequestIncidentSaga() {
  yield takeLatest(REQUEST_INCIDENT, fetchIncident);
}
