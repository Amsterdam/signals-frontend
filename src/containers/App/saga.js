import { takeLatest } from 'redux-saga/effects';

import { LOGOUT } from './constants';

export function* logout() {
  try {
    // remove the grip cookies


  } catch (error) {
    console.error('Error during logout', error); // eslint-disable-line no-console
  }
}

export default function* watchMapContainerSaga() {
  yield [
    takeLatest(LOGOUT, logout)
  ];
}
