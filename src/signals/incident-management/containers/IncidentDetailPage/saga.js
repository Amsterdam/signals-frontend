import { put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_NOTES_LIST } from './constants';
import { requestNotesListSuccess, requestNotesListError } from './actions';
import { authCall } from '../../../../shared/services/api/api';

export function* fetchIncidentNotesList(action) {
  const signalId = action.payload;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/note`;

  try {
    const incidentNotesList = yield authCall(requestURL, { _signal__id: signalId });
    yield put(requestNotesListSuccess(incidentNotesList));
  } catch (error) {
    yield put(requestNotesListError(error));
  }
}

export default function* watchIncidentDetailContainerSaga() {
  yield takeLatest(REQUEST_NOTES_LIST, fetchIncidentNotesList);
}
