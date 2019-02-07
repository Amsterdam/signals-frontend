import { put, takeLatest } from 'redux-saga/effects';

import { authCall } from 'shared/services/api/api';
import { REQUEST_NOTES_LIST } from './constants';
import { requestNotesListSuccess, requestNotesListError } from './actions';
import watchIncidentDetailContainerSaga, { fetchIncidentNotesList } from './saga';

jest.mock('shared/services/api/api');

describe('IncidentDetailPage saga', () => {
  it('should watchIncidentDetailContainerSaga', () => {
    const gen = watchIncidentDetailContainerSaga();
    expect(gen.next().value).toEqual(takeLatest(REQUEST_NOTES_LIST, fetchIncidentNotesList));
  });

  it('should fetchIncidentNotesList success', () => {
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/note';
    const note = { note: 'Note 1' };
    const updatedNote = { note: 'Note 1' };
    const action = { payload: note };

    const gen = fetchIncidentNotesList(action);
    expect(gen.next().value).toEqual(authCall(requestURL, note)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(note).value).toEqual(put(requestNotesListSuccess(updatedNote))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncidentNotesList error', () => {
    const signalId = 1000;
    const action = { payload: { _signal__id: signalId } };
    const error = new Error('404 Not Found');

    const gen = fetchIncidentNotesList(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestNotesListError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
