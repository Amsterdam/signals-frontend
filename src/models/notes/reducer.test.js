
import { fromJS } from 'immutable';
import notesModelReducer, { initialState } from './reducer';
import {
  REQUEST_NOTES_LIST,
  REQUEST_NOTES_LIST_SUCCESS,
  REQUEST_NOTES_LIST_ERROR
}
  from './constants';

describe('notesModelReducer', () => {
  const reducer = notesModelReducer;
  const expected = {
    id: null,
    loading: false,
    error: false,
    incidentNotesList: [],
  };

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_NOTES_LIST', () => {
    it('resets error and loading', () => {
      expect(
        notesModelReducer(undefined, {
          type: REQUEST_NOTES_LIST
        }).toJS()
      ).toEqual({
        ...expected,
        loading: true
      });
    });
  });

  describe('REQUEST_NOTES_LIST_SUCCESS', () => {
    it('sets notes list and loading', () => {
      expect(
        notesModelReducer(undefined, {
          type: REQUEST_NOTES_LIST_SUCCESS,
          payload: {
            results: ['Note 1', 'Note 2']
          }
        }).toJS()
      ).toEqual({
        ...expected,
        incidentNotesList: ['Note 1', 'Note 2']
      });
    });
  });

  describe('REQUEST_NOTES_LIST_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        notesModelReducer(undefined, {
          type: REQUEST_NOTES_LIST_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        ...expected,
        error: true
      });
    });
  });
});
