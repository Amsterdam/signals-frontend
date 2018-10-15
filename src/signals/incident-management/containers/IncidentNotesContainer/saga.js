import { call, all, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import CONFIGURATION from 'shared/services/configuration/configuration';
import { authCall, authPostCall } from 'shared/services/api/api';

import { REQUEST_NOTES_LIST, REQUEST_NOTE_CREATE } from './constants';
import { requestNotesListSuccess, requestNotesListError, requestNoteCreateSuccess, requestNoteCreateError } from './actions';

// const baseURL = '/api/auth/auth/status';
export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/notes`;

export function* fetchIncidentNotesList(action) {
  const signalId = action.payload;
  const requestURL = `${baseUrl}`;

  try {
    const incidentNotesList = yield authCall(requestURL, { _signal__id: signalId });
    yield put(requestNotesListSuccess(incidentNotesList));
  } catch (error) {
    yield put(requestNotesListError(error));
  }
}

export function* createIncidentNote(action) {
  const status = action.payload;
  const requestURL = `${baseUrl}/`;

  try {
    const updatedNotes = yield authPostCall(requestURL, status);
    yield call(delay, 1000);
    yield put(requestNoteCreateSuccess(updatedNotes));
  } catch (error) {
    yield put(requestNoteCreateError(error));
  }
}

export default function* watchIncidentNotesContainerSaga() {
  yield all([
    takeLatest(REQUEST_NOTES_LIST, fetchIncidentNotesList),
    takeLatest(REQUEST_NOTE_CREATE, createIncidentNote)
  ]);
}
