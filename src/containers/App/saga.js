import {
  all,
  call,
  put,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import { push } from 'react-router-redux';
import request from 'utils/request';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
import mapCategories from '../../shared/services/map-categories';

import {
  LOGOUT,
  LOGIN,
  AUTHENTICATE_USER,
  REQUEST_CATEGORIES,
  UPLOAD_REQUEST,
} from './constants';
import {
  loginFailed,
  logoutFailed,
  showGlobalError,
  authorizeUser,
  requestCategoriesSuccess,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
} from './actions';
import { login, logout, getOauthDomain } from '../../shared/services/auth/auth';

import fileUploadChannel from '../../shared/services/file-upload-channel';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/user/auth/me/`;

export function* callLogin(action) {
  try {
    yield call(login, action.payload);
  } catch (error) {
    yield put(loginFailed(error.message));
    yield put(showGlobalError('LOGIN_FAILED'));
  }
}

export function* callLogout() {
  try {
    // This forces the remove of the grip cookies.
    if (getOauthDomain() === 'grip') {
      window
        .open(
          'https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t',
          '_blank',
        )
        .close();
    }
    yield call(logout);
    yield put(push('/'));
  } catch (error) {
    yield put(logoutFailed(error.message));
    yield put(showGlobalError('LOGOUT_FAILED'));
  }
}

export function* callAuthorize(action) {
  try {
    const accessToken = action.payload && action.payload.accessToken;

    if (accessToken) {
      const user = yield call(authCall, baseUrl, null, accessToken);

      const credentials = {
        ...action.payload,
        userScopes: user.groups,
        userPermissions: user.permissions,
      };

      yield put(authorizeUser(credentials));
    }
  } catch (error) {
    const { response } = error;

    if (response.status === 401) {
      yield call(logout);
      yield put(push('/login'));
    } else {
      yield put(showGlobalError('AUTHORIZE_FAILED'));
    }
  }
}

export function* fetchCategories() {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/public/terms/categories/`;

  try {
    const categories = yield call(request, requestURL);

    yield put(requestCategoriesSuccess(mapCategories(categories)));
  } catch (err) {
    yield put(showGlobalError('FETCH_CATEGORIES_FAILED'));
  }
}

export function* uploadFileWrapper(action) {
  yield call(uploadFile, action);
}

export function* uploadFile(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/signal/image/`;

  const channel = yield call(
    fileUploadChannel,
    requestURL,
    action.payload.file,
    action.payload.id,
  );
  const forever = true;
  while (forever) {
    const { progress = 0, error, success } = yield take(channel);
    if (error) {
      yield put(uploadFailure());
      yield put(showGlobalError('UPLOAD_FAILED'));
      return;
    }
    if (success) {
      yield put(uploadSuccess(action.payload.file));
      return;
    }
    yield put(uploadProgress(progress));
  }
}

export default function* watchAppSaga() {
  yield all([
    takeLatest(LOGIN, callLogin),
    takeLatest(LOGOUT, callLogout),
    takeLatest(AUTHENTICATE_USER, callAuthorize),
    takeLatest(REQUEST_CATEGORIES, fetchCategories),
    takeEvery(UPLOAD_REQUEST, uploadFileWrapper),
  ]);
}
