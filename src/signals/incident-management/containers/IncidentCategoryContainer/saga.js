import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { authPatchCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_CATEGORY_UPDATE } from './constants';
import { requestCategoryUpdateSuccess, requestCategoryUpdateError } from './actions';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/category`;

export function* updateIncidentCategory(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  const payload = action.payload;

  try {
    const updatedCategory = yield authPatchCall(`${requestURL}/${payload.id}`, payload.patch);
    yield call(delay, 1000);
    yield put(requestCategoryUpdateSuccess(updatedCategory));
  } catch (error) {
    yield put(requestCategoryUpdateError(error));
  }
}

export default function* watchIncidentCategorySaga() {
  yield takeLatest(REQUEST_CATEGORY_UPDATE, updateIncidentCategory);
}
