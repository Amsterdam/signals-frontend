import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Sentry from '@sentry/browser';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPostCall, getErrorMessage } from 'shared/services/api/api';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

import { FETCH_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS } from './constants';
import {
  fetchDefaultTextsSuccess,
  fetchDefaultTextsError,
  storeDefaultTextsSuccess,
  storeDefaultTextsError,
} from './actions';

export function* fetchDefaultTexts(action) {
  try {
    const payload = action.payload;
    const result = yield call(
      authCall,
      `${CONFIGURATION.TERMS_ENDPOINT}${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`
    );
    const found = result.find(item => item.state === payload.state);
    yield put(fetchDefaultTextsSuccess((found?.templates) || []));
  } catch (error) {
    yield put(fetchDefaultTextsError(error));

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'Het standaard teksten overzicht kon niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    yield call([Sentry, 'captureException'], error);
  }
}

export function* storeDefaultTexts(action) {
  try {
    const payload = action.payload;
    const { subcategory } = payload;
    const result = yield call(
      authPostCall,
      `${CONFIGURATION.TERMS_ENDPOINT}${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`,
      [payload.post]
    );

    const found = result.find(item => item?.state === payload.post.state);

    yield put(storeDefaultTextsSuccess((found?.templates) || []));

    const numStoredTemplates = found?.templates?.length || 0;

    yield put(
      showGlobalNotification({
        title: `${numStoredTemplates} Standaard tekst${numStoredTemplates === 0 || numStoredTemplates > 1 ? 'en' : ''} opgeslagen voor ${subcategory.value}, ${payload.status.value}`,
        variant: VARIANT_SUCCESS,
        type: TYPE_LOCAL,
      })
    );
  } catch (error) {
    yield put(storeDefaultTextsError(error));

    yield put(
      showGlobalNotification({
        title: getErrorMessage(error),
        message: 'De standaard teksten konden niet opgeslagen worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    yield call([Sentry, 'captureException'], error);
  }
}

export default function* watchDefaultTextsAdminSaga() {
  yield all([
    takeLatest(FETCH_DEFAULT_TEXTS, fetchDefaultTexts),
    takeLatest(STORE_DEFAULT_TEXTS, storeDefaultTexts),
  ]);
}
