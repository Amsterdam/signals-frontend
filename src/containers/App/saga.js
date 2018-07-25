import { all, takeLatest, put } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import { LOGOUT, LOGIN, AUTHENTICATE_USER } from './constants';
import { showGlobalError, authorizeUser } from './actions';
import { login, logout } from '../../shared/services/auth/auth';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/me`;

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
    yield put(push('/'));
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
    yield put(showGlobalError(error));
  }
}

export function* callAuthorize(action) {
  try {
    const accessToken = action.payload && action.payload.accessToken;
    if (accessToken) {
      const requestURL = `${baseUrl}`;

      const user = yield authCall(requestURL, null, accessToken);

      const credentials = { ...action.payload, userScopes: [...user.groups] };
      yield put(authorizeUser(credentials));
    }
  } catch (error) {
    // console.error('Error during authorization', error); // eslint-disable-line no-console
    yield put(showGlobalError(error));
  }
}


export default function* watchAppSaga() {
  yield all([
    takeLatest(LOGIN, callLogin),
    takeLatest(LOGOUT, callLogout),
    takeLatest(AUTHENTICATE_USER, callAuthorize),
  ]);
}
