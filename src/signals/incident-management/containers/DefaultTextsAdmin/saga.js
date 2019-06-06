import { all, put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPostCall, authPatchCall } from 'shared/services/api/api';

import { FETCH_DEFAULT_TEXTS, STORE_DEFAULT_TEXTS } from './constants';
import { fetchDefaultTextsSuccess, fetchDefaultTextsError, storeDefaultTextsSuccess, storeDefaultTextsError } from './actions';

import { renumberOrder, sortByOrder, addTrailingItems } from './services/ordering-utils';

export function* fetchDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/public/terms/categories`;
  try {
    const payload = action.payload;
    const result = yield authCall(`${requestURL}/${payload.main_slug}/sub_categories/${payload.sub_slug}/status-message-templates`, { state: payload.state });
    yield put(fetchDefaultTextsSuccess(addTrailingItems(renumberOrder(sortByOrder(result)))));
  } catch (error) {
    yield put(fetchDefaultTextsError(error));
  }
}

export function* storeDefaultTexts(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/status-message-templates/`;
  try {
    let posts = [];
    let patches = [];
    const payload = action.payload;
    if (payload.post && payload.post.length) {
      posts = yield authPostCall(requestURL, payload.post);
    }

    if (payload.patch && payload.patch.length) {
      patches = yield authPatchCall(requestURL, payload.patch);
    }
    yield put(storeDefaultTextsSuccess(addTrailingItems([...posts, ...patches])));
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
