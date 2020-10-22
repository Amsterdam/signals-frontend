import { all, call, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';

import { authCall } from 'shared/services/api/api';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants';
import {
  SET_SEARCH_QUERY,
  LOGOUT,
  LOGIN,
  AUTHENTICATE_USER,
  UPLOAD_REQUEST,
  GET_SOURCES,
} from 'containers/App/constants';

import {
  loginFailed,
  logoutFailed,
  showGlobalNotification,
  authorizeUser,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  getSourcesFailed,
  getSourcesSuccess,
} from './actions';
import { login, logout, getOauthDomain } from '../../shared/services/auth/auth';

import fileUploadChannel from '../../shared/services/file-upload-channel';

export function* callLogin(action) {
  try {
    yield call(login, action.payload);
  } catch (error) {
    yield put(loginFailed(error.message));
    yield put(
      showGlobalNotification({
        variant: VARIANT_ERROR,
        title: 'Inloggen is niet gelukt',
        type: TYPE_GLOBAL,
      })
    );
  }
}

export function* callLogout() {
  try {
    // This forces the remove of the grip cookies.
    if (getOauthDomain() === 'grip') {
      window.open('https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t', '_blank').close();
    }

    yield call(logout);
    yield put(push('/login'));
  } catch (error) {
    yield put(logoutFailed(error.message));
    yield put(
      showGlobalNotification({
        variant: VARIANT_ERROR,
        title: 'Uitloggen is niet gelukt',
        type: TYPE_GLOBAL,
      })
    );
  }
}

export function* callAuthorize(action) {
  try {
    const accessToken = action.payload && action.payload.accessToken;

    if (accessToken) {
      const user = yield call(authCall, CONFIGURATION.AUTH_ME_ENDPOINT, null, accessToken);

      yield put(authorizeUser(user));
    }
  } catch (error) {
    const { response } = error;

    if (response.status === 401) {
      yield call(logout);
      yield put(push('/login'));
    } else {
      yield put(
        showGlobalNotification({
          variant: VARIANT_ERROR,
          title: 'Authenticeren is niet gelukt',
          type: TYPE_GLOBAL,
        })
      );
    }
  }
}

export function* uploadFileWrapper(action) {
  yield call(uploadFile, action);
}

export function* uploadFile(action) {
  const { id } = action.payload;
  const channel = yield call(
    fileUploadChannel,
    `${CONFIGURATION.INCIDENT_PUBLIC_ENDPOINT}${id}/attachments/`,
    action.payload.file,
    id
  );

  while (true) {
    const { progress = 0, error, success } = yield take(channel);

    if (error) {
      yield put(uploadFailure());
      yield put(
        showGlobalNotification({
          variant: VARIANT_ERROR,
          title: 'Het uploaden van de foto is niet gelukt',
          type: TYPE_GLOBAL,
        })
      );
      return;
    }

    if (success) {
      yield put(uploadSuccess(action.payload.file));
      return;
    }

    yield put(uploadProgress(progress));
  }
}

export function* callSearchIncidents() {
  yield put(push('/manage/incidents'));
}

export function* fetchSources() {
  try {
    const result = yield call(authCall, CONFIGURATION.SOURCES_ENDPOINT);

    yield put(getSourcesSuccess(result.results));
  } catch (error) {
    yield put(getSourcesFailed(error.message));
  }
}

export default function* watchAppSaga() {
  yield all([
    takeLatest(LOGIN, callLogin),
    takeLatest(LOGOUT, callLogout),
    takeLatest(AUTHENTICATE_USER, callAuthorize),
    takeEvery(UPLOAD_REQUEST, uploadFileWrapper),
    takeLatest(SET_SEARCH_QUERY, callSearchIncidents),
    takeLatest(GET_SOURCES, fetchSources),
  ]);
}
