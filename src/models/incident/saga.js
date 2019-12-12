import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPatchCall } from 'shared/services/api/api';

import {
  REQUEST_INCIDENT,
  PATCH_INCIDENT,
  REQUEST_ATTACHMENTS,
  REQUEST_DEFAULT_TEXTS,
} from './constants';
import {
  requestIncidentSuccess,
  requestIncidentError,
  patchIncidentSuccess,
  patchIncidentError,
  requestAttachmentsSuccess,
  requestAttachmentsError,
  requestDefaultTextsSuccess,
  requestDefaultTextsError,
} from './actions';
import { requestHistoryList } from '../history/actions';

export function* fetchIncident(action) {
  try {
    const id = action.payload;
    const incident = yield call(authCall, `${CONFIGURATION.INCIDENTS_ENDPOINT}${id}`);

    yield put(requestIncidentSuccess(incident));
  } catch (error) {
    yield put(requestIncidentError(error));
  }
}

export function* patchIncident(action) {
  const payload = action.payload;
  try {
    const incident = yield call(
      authPatchCall,
      `${CONFIGURATION.INCIDENTS_ENDPOINT}${payload.id}`,
      payload.patch,
    );

    yield put(patchIncidentSuccess({ type: payload.type, incident }));
    yield put(requestHistoryList(payload.id));
  } catch (error) {
    const { response } = error;

    if (response.status === 403) {
      global.alert('Je hebt geen toestemming om deze actie uit te voeren.');
    }

    yield put(patchIncidentError({ type: payload.type, error }));
  }
}

export function* requestAttachments(action) {
  try {
    const id = action.payload;
    const attachments = yield call(authCall, `${CONFIGURATION.INCIDENTS_ENDPOINT}${id}/attachments`);

    yield put(requestAttachmentsSuccess(attachments.results.slice(0, 3)));
  } catch (error) {
    yield put(requestAttachmentsError());
  }
}

export function* requestDefaultTexts(action) {
  try {
    const payload = action.payload;
    const result = yield call(
      authCall,
      `${CONFIGURATION.TERMS_ENDPOINT}${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`,
    );
    yield put(requestDefaultTextsSuccess(result));
  } catch (error) {
    yield put(requestDefaultTextsError(error));
  }
}

export default function* watchIncidentModelSaga() {
  yield all([
    takeLatest(REQUEST_INCIDENT, fetchIncident),
    takeLatest(PATCH_INCIDENT, patchIncident),
    takeLatest(REQUEST_ATTACHMENTS, requestAttachments),
    takeLatest(REQUEST_DEFAULT_TEXTS, requestDefaultTexts),
  ]);
}
