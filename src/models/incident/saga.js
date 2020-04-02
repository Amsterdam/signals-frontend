import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPatchCall, getErrorMessage } from 'shared/services/api/api';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import {
  REQUEST_INCIDENT,
  PATCH_INCIDENT,
  REQUEST_ATTACHMENTS,
  REQUEST_DEFAULT_TEXTS,
  PATCH_TYPE_NOTES,
  PATCH_TYPE_SUBCATEGORY,
  PATCH_TYPE_STATUS,
  PATCH_TYPE_PRIORITY,
  PATCH_TYPE_THOR,
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

    yield put(showGlobalNotification({
      title: getErrorMessage(error),
      message: 'De melding gegevens konden niet opgehaald worden',
      variant: VARIANT_ERROR,
      type: TYPE_LOCAL,
    }));

    yield call([Sentry, 'captureException'], error);
  }
}

export const errorMessageDictionary = {
  [PATCH_TYPE_NOTES]: 'Je hebt niet voldoende rechten om notities toe te voegen',
  [PATCH_TYPE_SUBCATEGORY]: 'Je hebt niet voldoende rechten om de subcategorie te wijzigen',
  [PATCH_TYPE_STATUS]: 'Je hebt niet voldoende rechten om de status te wijzigen',
  [PATCH_TYPE_PRIORITY]: 'Je hebt niet voldoende rechten om de urgentie te wijzigen',
  [PATCH_TYPE_THOR]: 'Je hebt niet voldoende rechten om de melding extern door te zetten',
  default: 'Je hebt niet voldoende rechten om deze actie uit te voeren',
};

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
    yield put(patchIncidentError({ type: payload.type, error }));

    yield put(showGlobalNotification({
      title: getErrorMessage(error),
      message: errorMessageDictionary[action.payload.type] || errorMessageDictionary.default,
      variant: VARIANT_ERROR,
      type: TYPE_LOCAL,
    }));
  }
}

export function* requestAttachments(action) {
  try {
    const id = action.payload;
    const attachments = yield call(authCall, `${CONFIGURATION.INCIDENTS_ENDPOINT}${id}/attachments`);

    yield put(requestAttachmentsSuccess(attachments.results.slice(0, 3)));
  } catch (error) {
    yield put(requestAttachmentsError());

    yield put(showGlobalNotification({
      title: getErrorMessage(error),
      message: 'Bijlagen konden niet geladen worden',
      variant: VARIANT_ERROR,
      type: TYPE_LOCAL,
    }));

    yield call([Sentry, 'captureException'], error);
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

    yield put(showGlobalNotification({
      title: getErrorMessage(error),
      message: 'Standaard teksten konden niet geladen worden',
      variant: VARIANT_ERROR,
      type: TYPE_LOCAL,
    }));

    yield call([Sentry, 'captureException'], error);
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
