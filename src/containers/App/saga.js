import { all, call, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';

import {
  LOGOUT,
  LOGIN,
  AUTHENTICATE_USER,
  UPLOAD_REQUEST
} from './constants';
import {
  showGlobalError,
  authorizeUser,
  uploadProgress,
  uploadSuccess,
  uploadFailure
} from './actions';
import { login, logout, getOauthDomain } from '../../shared/services/auth/auth';

import fileUploadChannel from '../../shared/services/file-upload-channel';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/me`;

export function* callLogin(action) {
  try {
    login(action.payload);
  } catch (error) {
    // console.error('Error during logout', error); // eslint-disable-line no-console
    yield put(showGlobalError(error));
  }
}

export function* callLogout() {
  try {
    // This forces the remove of the grip cookies.
    if (getOauthDomain() === 'grip') {
      window.open('https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t', '_blank').close();
    }
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

export function* uploadFile(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/image/`;

  const channel = yield call(fileUploadChannel, requestURL, action.payload.file, action.payload.id);
  const forever = true;
  while (forever) {
    const { progress = 0, error, success } = yield take(channel);
    if (error) {
      yield put(uploadFailure(action.payload.file, error));
      yield put(showGlobalError('UPLOAD_FAILED'));
      return;
    }
    if (success) {
      yield put(uploadSuccess(action.payload.file));
      return;
    }
    yield put(uploadProgress(action.payload.file, progress));
  }
}

function* uploadFileWrapper(action) {
  yield call(uploadFile, action);
}


export default function* watchAppSaga() {
  yield all([
    takeLatest(LOGIN, callLogin),
    takeLatest(LOGOUT, callLogout),
    takeLatest(AUTHENTICATE_USER, callAuthorize),
    takeEvery(UPLOAD_REQUEST, uploadFileWrapper)
  ]);
}
