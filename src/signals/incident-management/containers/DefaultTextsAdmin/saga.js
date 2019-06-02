import { all, put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPatchCall } from 'shared/services/api/api';

import { FETCH_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS } from './constants';
import { fetchDefaultTextsSuccess, fetchDefaultTextsError, storeDefaultTextsSuccess, storeDefaultTextsError } from './actions';

export function* fetchDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/public/terms/categories`;
  try {
    const payload = action.payload;
    const result = yield authCall(`${requestURL}/${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`);
    yield put(fetchDefaultTextsSuccess(result));
  } catch (error) {
    yield put(fetchDefaultTextsError(error));
  }
}

export function* storeDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/status-message-templates`;
  try {
    const payload = action.payload;
    console.log('saga store', payload);
    const result = yield authPatchCall(requestURL, payload);
    yield put(storeDefaultTextsSuccess(result));
  } catch (error) {
    yield put(storeDefaultTextsError(error));
  }
}

export default function* watchDefaultTextsAdminSaga() {
  yield all([
    takeLatest(FETCH_DEFAULT_TEXTS, fetchDefaultTexts),
    takeLatest(STORE_DEFAULT_TEXTS, storeDefaultTexts)
  ]);
}
