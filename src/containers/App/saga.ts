import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';

import { authCall } from 'shared/services/api/api';
import configuration from 'shared/services/configuration/configuration';
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants';
import type endpointDefinitions from 'shared/services/configuration/endpoint-definitions';
import {
  SET_SEARCH_QUERY,
  LOGOUT,
  AUTHENTICATE_USER,
  GET_SOURCES,
} from 'containers/App/constants';

import {
  logoutFailed,
  showGlobalNotification,
  authorizeUser,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  getSourcesFailed,
  getSourcesSuccess,
} from './actions';
import { logout, getOauthDomain } from '../../shared/services/auth/auth';

import fileUploadChannel from '../../shared/services/file-upload-channel';
import type { Action, User, UserCredentials, DataResult, ApiError, UploadFile } from './types';

const CONFIGURATION = configuration as typeof endpointDefinitions;

export function* callLogout() {
  try {
    // This forces the remove of the grip cookies.
    if (getOauthDomain() === 'grip') {
      window.open('https://auth.grip-on-it.com/v2/logout?tenantId=rjsfm52t', '_blank')?.close();
    }

    yield call(logout);
    yield put(push('/login'));
  } catch (error: unknown) {
    yield put(logoutFailed((error as Error)?.message));
    yield put(
      showGlobalNotification({
        variant: VARIANT_ERROR,
        title: 'Uitloggen is niet gelukt',
        type: TYPE_GLOBAL,
      })
    );
  }
}

export function* callAuthorize(action: Action<Partial<UserCredentials>>) {
  try {
    const accessToken = action.payload?.accessToken;

    if (accessToken) {
      const user: unknown = yield call(authCall, CONFIGURATION.AUTH_ME_ENDPOINT, null, accessToken);

      yield put(authorizeUser(user as User));
    }
  } catch (error: unknown) {
    const { response } = error as ApiError;

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

export function* uploadFile(action: Action<UploadFile>) {
  const id = action.payload?.id ?? '';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const channel = yield call(
    fileUploadChannel,
    `${CONFIGURATION.INCIDENT_PUBLIC_ENDPOINT}${id}/attachments/`,
    action.payload?.file,
    id
  );

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      yield put(uploadSuccess());
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = yield call(authCall, CONFIGURATION.SOURCES_ENDPOINT);

    yield put(getSourcesSuccess((result as DataResult<string>).results));
  } catch (error: unknown) {
    yield put(getSourcesFailed((error as Error).message));
  }
}

export default function* watchAppSaga() {
  yield all([
    takeLatest(LOGOUT, callLogout),
    takeLatest(AUTHENTICATE_USER, callAuthorize),
    takeLatest(SET_SEARCH_QUERY, callSearchIncidents),
    takeLatest(GET_SOURCES, fetchSources),
  ]);
}
