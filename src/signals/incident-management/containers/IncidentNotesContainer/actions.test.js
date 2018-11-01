import { testActionCreator } from '../../../../../internals/testing/test-utils';

import {
  REQUEST_NOTE_CREATE, REQUEST_NOTE_CREATE_SUCCESS, REQUEST_NOTE_CREATE_ERROR
} from './constants';

import {
  requestNoteCreate, requestNoteCreateSuccess, requestNoteCreateError
} from './actions';


describe('Incident note container actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestNoteCreate, REQUEST_NOTE_CREATE, payload);
    testActionCreator(requestNoteCreateSuccess, REQUEST_NOTE_CREATE_SUCCESS, payload);
    testActionCreator(requestNoteCreateError, REQUEST_NOTE_CREATE_ERROR, payload);
  });
});
