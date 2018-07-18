import { put, takeLatest, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { LOGOUT, LOGIN } from './constants';
import { login } from '../../shared/services/auth/auth';

export function* callLogin() {
  try {
    console.log('callLogin');
    login();
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
    // yield put(showGlobalError(error));
  }
}

export function* callLogout() {
  try {
    // remove the grip cookies
    console.log(' remove the grip cookies');
    yield call('https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t');
    yield put(push('/'));
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
  }
}

export default function* watchAppSaga() {
  console.log('watchAppSaga');
  yield [
    takeLatest(LOGIN, callLogin),
    takeLatest(LOGOUT, callLogout)
  ];
}
