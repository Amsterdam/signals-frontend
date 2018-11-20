import { all, put, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { REQUEST_INCIDENT, REQUEST_NOTES_LIST } from './constants';
import { requestIncidentSuccess, requestIncidentError, requestNotesListSuccess, requestNotesListError } from './actions';
import { authCall } from '../../../../shared/services/api/api';

export function* fetchIncident(action) {
  const requestURL = `${CONFIGURATION.API_ROOT}signals/auth/signal`;
  try {
    const id = action.payload;
    const incident = yield authCall(`${requestURL}/${id}/`);
    yield put(requestIncidentSuccess(incident));
  } catch (err) {
    yield put(requestIncidentError(err));
  }
}

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
  yield all([
    takeLatest(REQUEST_INCIDENT, fetchIncident),
    takeLatest(REQUEST_NOTES_LIST, fetchIncidentNotesList)
  ]);
}
