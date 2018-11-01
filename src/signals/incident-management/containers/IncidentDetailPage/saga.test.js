import { all, put, takeLatest } from 'redux-saga/effects';

import { authCall } from 'shared/services/api/api';
import { REQUEST_INCIDENT, REQUEST_NOTES_LIST } from './constants';
import { requestIncidentSuccess, requestIncidentError, requestNotesListSuccess, requestNotesListError } from './actions';
import watchIncidentDetailContainerSaga, { fetchIncident, fetchIncidentNotesList } from './saga';

jest.mock('shared/services/api/api');

describe('IncidentDetailPage saga', () => {
  it('should watchIncidentDetailContainerSaga', () => {
    const gen = watchIncidentDetailContainerSaga();
    expect(gen.next().value).toEqual(all([ // eslint-disable-line redux-saga/yield-effects
      takeLatest(REQUEST_INCIDENT, fetchIncident),
      takeLatest(REQUEST_NOTES_LIST, fetchIncidentNotesList)
    ]));
  });

  it('should fetchIncident success', () => {
    const requestURL = 'https://acc.api.data.amsterdam.nl/signals/auth/signal';
    const id = 1000;
    const action = { payload: id };
    const incident = { id, name: 'incident' };

    const gen = fetchIncident(action);
    expect(gen.next().value).toEqual(authCall(`${requestURL}/${id}`));
    expect(gen.next(incident).value).toEqual(put(requestIncidentSuccess(incident))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should fetchIncident error', () => {
    const id = 1000;
    const action = { payload: id };
    const error = new Error('404 Not Found');

    const gen = fetchIncident(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestIncidentError(error))); // eslint-disable-line redux-saga/yield-effects
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
