import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { REQUEST_INCIDENTS } from './constants';
import { requestIncidentsSuccess, requestIncidentsError } from './actions';
import makeSelectOverviewPage from './selectors';

export function* fetchIncidents() {
  const requestURL = '/api/users';

  try {
    const { filter } = yield select(makeSelectOverviewPage());
    const incidents = yield call(request, requestURL, filter);
    yield put(requestIncidentsSuccess(incidents));
  } catch (err) {
    yield put(requestIncidentsError(err));
  }
}

// Individual exports for testing
export default function* watchRequestIncidentsSaga() {
  yield takeLatest(REQUEST_INCIDENTS, fetchIncidents);
}
