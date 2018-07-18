import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { showGlobalError } from './actions';
import { LOGOUT } from './constants';

export function* logout() {
  try {
    // remove the grip cookies

    yield put(push('/'));
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
    yield put(showGlobalError(error));
  }
}

export default function* watchAppSaga() {
  yield takeLatest(LOGOUT, logout);
}
