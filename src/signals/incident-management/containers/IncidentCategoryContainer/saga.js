import { put, takeLatest } from 'redux-saga/effects';

import { authPostCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_CATEGORY_UPDATE } from './constants';
import { requestCategoryUpdateSuccess, requestCategoryUpdateError } from './actions';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/category`;

export function* updateIncidentCategory(action) {
  const category = action.payload;
  const requestURL = `${baseUrl}/`;

  try {
    const updatedCategory = yield authPostCall(requestURL, category);
    yield put(requestCategoryUpdateSuccess(updatedCategory));
  } catch (error) {
    yield put(requestCategoryUpdateError(error));
  }
}

export default function* watchIncidentCategorySaga() {
  yield takeLatest(REQUEST_CATEGORY_UPDATE, updateIncidentCategory);
}
