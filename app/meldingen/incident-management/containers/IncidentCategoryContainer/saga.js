import { put, takeLatest } from 'redux-saga/effects';
import { authPostCall } from '../../../../shared/services/api/api';

import { REQUEST_CATEGORY_UPDATE } from './constants';
import { requestCategoryUpdateSuccess, requestCategoryUpdateError } from './actions';

const baseUrl = 'https://acc.api.data.amsterdam.nl/signals/auth/category';

export function* updateIncidentCategory(action) {
  const status = action.payload;
  const requestURL = `${baseUrl}/`;

  try {
    const updatedCategory = yield authPostCall(requestURL, status);
    yield put(requestCategoryUpdateSuccess(updatedCategory));
  } catch (error) {
    yield put(requestCategoryUpdateError(error));
  }
}

export default function* watchRequestIncidentsSaga() {
  yield [
    takeLatest(REQUEST_CATEGORY_UPDATE, updateIncidentCategory)
  ];
}
