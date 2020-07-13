import {
  all, call, put, takeLatest,
} from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, getErrorMessage } from 'shared/services/api/api';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import {
  REQUEST_INCIDENT,
  REQUEST_ATTACHMENTS,
  REQUEST_DEFAULT_TEXTS,
} from './constants';
import {
  requestIncidentSuccess,
  requestIncidentError,
  requestAttachmentsSuccess,
  requestAttachmentsError,
  requestDefaultTextsSuccess,
  requestDefaultTextsError,
} from './actions';

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
    takeLatest(REQUEST_ATTACHMENTS, requestAttachments),
    takeLatest(REQUEST_DEFAULT_TEXTS, requestDefaultTexts),
  ]);
}
