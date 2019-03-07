import { testActionCreator } from 'test/utils';

import {
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR, REQUEST_ADD_NOTE
} from './constants';

import {
  requestNotesList, requestNotesListSuccess, requestNotesListError, requestAddNote
} from './actions';

describe('notesModel actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestNotesList, REQUEST_NOTES_LIST, payload);
    testActionCreator(requestNotesListSuccess, REQUEST_NOTES_LIST_SUCCESS, payload);
    testActionCreator(requestNotesListError, REQUEST_NOTES_LIST_ERROR, payload);
    testActionCreator(requestAddNote, REQUEST_ADD_NOTE, payload);
  });
});
