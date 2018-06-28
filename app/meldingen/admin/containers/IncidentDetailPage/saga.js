import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { REQUEST_INCIDENT } from './constants';
import { requestIncidentSuccess, requestIncidentError } from './actions';
import { authCall } from '../../../../shared/services/api/api';

export function* fetchIncident(action) {
  const requestURL = '/api/signal';

  try {
    const { id } = action;
    const incident = yield authCall(`${requestURL}/${id}`);
    yield call(delay, 500);
    yield put(requestIncidentSuccess(incident));
  } catch (err) {
    yield put(requestIncidentError(err));
  }
}

// Individual exports for testing
export default function* watchRequestIncidentSaga() {
  yield takeLatest(REQUEST_INCIDENT, fetchIncident);
}
