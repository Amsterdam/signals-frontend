import { all, call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPatchCall } from 'shared/services/api/api';

import { REQUEST_INCIDENT, PATCH_INCIDENT, DOWNLOAD_PDF } from './constants';
import { requestIncidentSuccess, requestIncidentError, patchIncidentSuccess, patchIncidentError } from './actions';
import { requestHistoryList } from '../history/actions';

export function* fetchIncident(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/signal`;
  try {
    const id = action.payload;
    const incident = yield authCall(`${requestURL}/${id}/`);
    yield put(requestIncidentSuccess(incident));
  } catch (error) {
    yield put(requestIncidentError(error));
  }
}

export function* downloadPdf(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  try {
    const id = action.payload;
    yield authCall(`${requestURL}/${id}/pdf`);
    // yield put(requestIncidentSuccess(incident));
  } catch (error) {
    // yield put(requestIncidentError(error));
  }
}

export function* patchIncident(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  const payload = action.payload;
  try {
    const incident = yield authPatchCall(`${requestURL}/${payload.id}`, payload.patch);
    yield call(delay, 1000);
    yield put(patchIncidentSuccess({ type: payload.type, incident }));
    yield put(requestHistoryList(payload.id));
  } catch (error) {
    yield put(patchIncidentError({ type: payload.type, error }));
  }
}

export default function* watchIncidentModelSaga() {
  yield all([
    takeLatest(REQUEST_INCIDENT, fetchIncident),
    takeLatest(PATCH_INCIDENT, patchIncident),
    takeLatest(DOWNLOAD_PDF, downloadPdf)
  ]);
}
