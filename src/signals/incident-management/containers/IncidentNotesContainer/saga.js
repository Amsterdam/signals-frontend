import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authPostCall } from 'shared/services/api/api';

import { requestAddNote } from 'models/notes/actions';
import { REQUEST_NOTE_CREATE } from './constants';
import { requestNoteCreateSuccess, requestNoteCreateError } from './actions';

export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/note`;

export function* createIncidentNote(action) {
  const status = action.payload;
  const requestURL = `${baseUrl}/`;

  try {
    const updatedNotes = yield authPostCall(requestURL, status);
    yield call(delay, 1000);
    yield put(requestNoteCreateSuccess(updatedNotes));
    yield put(requestAddNote(updatedNotes));
  } catch (error) {
    yield put(requestNoteCreateError(error));
  }
}

export default function* watchIncidentNotesContainerSaga() {
  yield takeLatest(REQUEST_NOTE_CREATE, createIncidentNote);
}
