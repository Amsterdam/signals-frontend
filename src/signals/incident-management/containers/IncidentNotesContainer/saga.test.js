import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { REQUEST_NOTE_CREATE } from './constants';
import { requestNoteCreateSuccess, requestNoteCreateError } from './actions';
import watchRequestIncidentSaga, { baseUrl, createIncidentNote } from './saga';
import { authPostCall } from '../../../../shared/services/api/api';

jest.mock('shared/services/api/api');
jest.mock('./selectors', () => {
  function mockedMakeSelectFilterParams() { }
  return ({
    makeSelectFilterParams: () => mockedMakeSelectFilterParams,
  });
});


describe('IncidentNotesContainer saga', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should watchIncidentNotesContainerSaga', () => {
    const gen = watchRequestIncidentSaga();
    expect(gen.next().value).toEqual(
      takeLatest(REQUEST_NOTE_CREATE, createIncidentNote)
    ); // eslint-disable-line redux-saga/yield-effects
  });

  it('should createIncidentNote success', () => {
    const note = { note: 'Note 1' };
    const action = { payload: note };
    const updatedNote = { note: 'Note 1' };
    const requestURL = `${baseUrl}/`;

    const gen = createIncidentNote(action);
    expect(gen.next().value).toEqual(authPostCall(requestURL, note)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next(note).value).toEqual(call(delay, 1000)); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(requestNoteCreateSuccess(updatedNote))); // eslint-disable-line redux-saga/yield-effects
  });

  it('should createIncidentNote error', () => {
    const action = { payload: { } };
    const error = new Error('404 Not Found');

    const gen = createIncidentNote(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(requestNoteCreateError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
