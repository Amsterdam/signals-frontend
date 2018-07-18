import { takeLatest } from 'redux-saga/effects';

import { LOGOUT, LOGIN } from './constants';
import { login, logout } from '../../shared/services/auth/auth';

export function* callLogin(action) {
  try {
    login(action.payload);
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
    // yield put(showGlobalError(error));
  }
}

export function* callLogout() {
  try {
    // TODO remove the grip cookies
    // console.log(' remove the grip cookies');
    // const options = {
    //   method: 'GET',
    //   mode: 'no-cors',
    // };
    // yield call(request, 'https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t', options);
    logout();
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
  }
}

export default function* watchAppSaga() {
  yield [
    takeLatest(LOGIN, callLogin),
    takeLatest(LOGOUT, callLogout)
  ];
}
