import {
  REQUEST_NOTES_LIST, REQUEST_NOTES_LIST_SUCCESS, REQUEST_NOTES_LIST_ERROR
} from './constants';

import {
  requestNotesList, requestNotesListSuccess, requestNotesListError
} from './actions';

import { testActionCreator } from '../../../internals/testing/test-utils';

describe('IncidentDetailPage actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestNotesList, REQUEST_NOTES_LIST, payload);
    testActionCreator(requestNotesListSuccess, REQUEST_NOTES_LIST_SUCCESS, payload);
    testActionCreator(requestNotesListError, REQUEST_NOTES_LIST_ERROR, payload);
  });
});
