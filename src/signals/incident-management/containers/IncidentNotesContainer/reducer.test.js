import { fromJS } from 'immutable';
import incidentNotesContainerReducer, { initialState } from './reducer';

import {
  REQUEST_NOTES_LIST,
  REQUEST_NOTES_LIST_SUCCESS,
  REQUEST_NOTES_LIST_ERROR,

  REQUEST_NOTE_CREATE,
  REQUEST_NOTE_CREATE_SUCCESS,
  REQUEST_NOTE_CREATE_ERROR
}
  from './constants';

describe('incidentNotesContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentNotesContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_NOTES_LIST', () => {
    it('resets error and loading', () => {
      expect(
        incidentNotesContainerReducer(undefined, {
          type: REQUEST_NOTES_LIST
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incidentNotesList: []
      });
    });
  });

  describe('REQUEST_NOTES_LIST_SUCCESS', () => {
    it('sets notes list and loading', () => {
      expect(
        incidentNotesContainerReducer(undefined, {
          type: REQUEST_NOTES_LIST_SUCCESS,
          payload: {
            results: ['Note 1', 'Note 2']
          }
        }).toJS()
      ).toEqual({
        loading: false,
        incidentNotesList: ['Note 1', 'Note 2']
      });
    });
  });

  describe('REQUEST_NOTES_LIST_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentNotesContainerReducer(undefined, {
          type: REQUEST_NOTES_LIST_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
        incidentNotesList: []
      });
    });
  });

  describe('REQUEST_NOTE_CREATE', () => {
    it('resets error and loading', () => {
      expect(
        incidentNotesContainerReducer(undefined, {
          type: REQUEST_NOTE_CREATE,
          payload: {
            note: 'Note'
          }
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incidentNotesList: []
      });
    });
  });

  describe('REQUEST_NOTE_CREATE_SUCCESS', () => {
    it('sets notes list and loading', () => {
      expect(
        incidentNotesContainerReducer(fromJS({
          incidentNotesList: [{ text: 'Note 2' }, { text: 'Note 1' }]
        }), {
          type: REQUEST_NOTE_CREATE_SUCCESS,
          payload: { text: 'Note 3' }
        }).toJS()
      ).toEqual({
        loading: false,
        incidentNotesList: [{ text: 'Note 3' }, { text: 'Note 2' }, { text: 'Note 1' }]
      });
    });

    it('sets notes list', () => {
      expect(
        incidentNotesContainerReducer(fromJS({
          incidentNotesList: [{ text: 'Note 2' }, { text: 'Note 1' }]
        }), {
          type: REQUEST_NOTE_CREATE_SUCCESS,
          payload: { text: 'Note 3' }
        }).toJS()
      ).toEqual({
        loading: false,
        incidentNotesList: [{ text: 'Note 3' }, { text: 'Note 2' }, { text: 'Note 1' }]
      });
    });
  });

  describe('REQUEST_NOTE_CREATE_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentNotesContainerReducer(undefined, {
          type: REQUEST_NOTE_CREATE_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
        incidentNotesList: []
      });
    });
  });
});
