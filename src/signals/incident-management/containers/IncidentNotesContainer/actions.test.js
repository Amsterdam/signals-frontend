import { testActionCreator } from '../../../../../internals/testing/test-utils';

import {
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR,
  REQUEST_NOTE_CREATE, REQUEST_NOTE_CREATE_SUCCESS, REQUEST_NOTE_CREATE_ERROR
}
  from './constants';

import {
  requestNotesList, requestNotesListSuccess, requestNotesListError,
  requestNoteCreate, requestNoteCreateSuccess, requestNoteCreateError
} from './actions';


describe('Incident note container actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestNotesList, REQUEST_NOTES_LIST, payload);
    testActionCreator(requestNotesListSuccess, REQUEST_NOTES_LIST_SUCCESS, payload);
    testActionCreator(requestNotesListError, REQUEST_NOTES_LIST_ERROR, payload);
    testActionCreator(requestNoteCreate, REQUEST_NOTE_CREATE, payload);
    testActionCreator(requestNoteCreateSuccess, REQUEST_NOTE_CREATE_SUCCESS, payload);
    testActionCreator(requestNoteCreateError, REQUEST_NOTE_CREATE_ERROR, payload);
  });
});
