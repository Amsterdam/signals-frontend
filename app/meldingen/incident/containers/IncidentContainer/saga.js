import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { SEND_INCIDENT } from './constants';
import { sendIncidentSuccess, sendIncidentError } from './actions';
import makeSelectIncidentContainer from './selectors';

export function* sendIncident() {
  const requestURL = '/api/meldingen';

  try {
    const { filter } = yield select(makeSelectIncidentContainer());
    const incidents = yield call(request, requestURL, filter);
    yield put(sendIncidentSuccess(incidents));
  } catch (err) {
    yield put(sendIncidentError(err));
  }
}

// Individual exports for testing
export default function* watchSetIncidentSaga() {
  yield takeLatest(SEND_INCIDENT, sendIncident);
}
