import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { REQUEST_INCIDENTS } from './constants';
import { requestIncidentsSuccess, requestIncidentsError } from './actions';

export function* fetchIncidents() {
  const requestURL = '/api/users';

  try {
    const incidents = yield call(request, requestURL);
    yield put(requestIncidentsSuccess(incidents));
  } catch (err) {
    yield put(requestIncidentsError(err));
  }
}

// Individual exports for testing
export default function* watchRequestIncidentsSaga() {
  yield takeLatest(REQUEST_INCIDENTS, fetchIncidents);
}
