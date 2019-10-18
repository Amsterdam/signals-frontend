import { all, put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPostCall } from 'shared/services/api/api';

import { FETCH_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS } from './constants';
import {
  fetchDefaultTextsSuccess, fetchDefaultTextsError, storeDefaultTextsSuccess, storeDefaultTextsError,
} from './actions';

export function* fetchDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/terms/categories`;
  try {
    const payload = action.payload;
    const result = yield authCall(`${requestURL}/${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`);
    const found = result.find(item => item.state === payload.state);
    yield put(fetchDefaultTextsSuccess((found && found.templates) || []));
  } catch (error) {
    yield put(fetchDefaultTextsError(error));
  }
}

export function* storeDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/terms/categories`;
  try {
    const payload = action.payload;
    const result = yield authPostCall(`${requestURL}/${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`, [payload.post]);
    const found = result.find(item => item.state === payload.post.state);
    yield put(storeDefaultTextsSuccess((found && found.templates) || []));
  } catch (error) {
    yield put(storeDefaultTextsError(error));
  }
}

export default function* watchDefaultTextsAdminSaga() {
  yield all([
    takeLatest(FETCH_DEFAULT_TEXTS, fetchDefaultTexts),
    takeLatest(STORE_DEFAULT_TEXTS, storeDefaultTexts),
  ]);
}
