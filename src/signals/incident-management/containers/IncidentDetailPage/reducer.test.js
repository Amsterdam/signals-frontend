
import { fromJS } from 'immutable';
import incidentDetailPageReducer, { initialState } from './reducer';
import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR,
  REQUEST_NOTES_LIST,
  REQUEST_NOTES_LIST_SUCCESS,
  REQUEST_NOTES_LIST_ERROR
}
  from './constants';

import { REQUEST_CATEGORY_UPDATE_SUCCESS } from '../IncidentCategoryContainer/constants';
import { REQUEST_PRIORITY_UPDATE_SUCCESS } from '../IncidentPriorityContainer/constants';
import { REQUEST_STATUS_CREATE_SUCCESS } from '../IncidentStatusContainer/constants';
import { REQUEST_NOTE_CREATE_SUCCESS } from '../IncidentNotesContainer/constants';

import priorityList from '../../definitions/priorityList';
import stadsdeelList from '../../definitions/stadsdeelList';

jest.mock('../../definitions/stadsdeelList');

describe('incidentDetailPageReducer', () => {
  const reducer = incidentDetailPageReducer;
  const expected = {
    id: null,
    loading: false,
    error: false,
    incidentNotesList: [],
    priorityList,
    stadsdeelList
  };
  let state;

  beforeEach(() => {
    state = fromJS({
      incident: {},
      incidentNotesList: [],
    });
  });

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS(initialState));
  });

  it('should handle the REQUEST_INCIDENT', () => {
    expect(
      incidentDetailPageReducer(undefined, {
        type: REQUEST_INCIDENT,
        payload: 42
      }).toJS()
    ).toEqual({
      ...expected,
      id: 42,
      incident: null,
      loading: true
    });
  });

  it('should handle the REQUEST_INCIDENT_SUCCESS', () => {
    const payload = { id: 1 };
    expect(
      incidentDetailPageReducer(undefined, {
        type: REQUEST_INCIDENT_SUCCESS,
        payload
      }).toJS()
    ).toEqual({
      ...expected,
      incident: {
        id: 1
      }
    });
  });

  it('should handle the REQUEST_INCIDENT_ERROR', () => {
    expect(
      incidentDetailPageReducer(undefined, {
        type: REQUEST_INCIDENT_ERROR,
        payload: true
      }).toJS()
    ).toEqual({
      ...expected,
      error: true
    });
  });

  describe('REQUEST_NOTES_LIST', () => {
    it('resets error and loading', () => {
      expect(
        incidentDetailPageReducer(undefined, {
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
        incidentDetailPageReducer(undefined, {
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
        incidentDetailPageReducer(undefined, {
          type: REQUEST_NOTES_LIST_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        ...expected,
        error: true
      });
    });
  });

  it('should handle the REQUEST_CATEGORY_UPDATE_SUCCESS', () => {
    expect(
      incidentDetailPageReducer(state, {
        type: REQUEST_CATEGORY_UPDATE_SUCCESS,
        payload: 'test'
      }).toJS()
    ).toEqual({
      incident: {
        category: 'test'
      },
      incidentNotesList: []
    });
  });

  it('should handle the REQUEST_PRIORITY_UPDATE_SUCCESS', () => {
    expect(
      incidentDetailPageReducer(state, {
        type: REQUEST_PRIORITY_UPDATE_SUCCESS,
        payload: 'high'
      }).toJS()
    ).toEqual({
      incident: {
        priority: 'high'
      },
      incidentNotesList: []
    });
  });

  it('should handle the REQUEST_STATUS_CREATE_SUCCESS', () => {
    expect(
      incidentDetailPageReducer(state, {
        type: REQUEST_STATUS_CREATE_SUCCESS,
        payload: 'gemeld'
      }).toJS()
    ).toEqual({
      incident: {
        status: 'gemeld'
      },
      incidentNotesList: []
    });
  });

  it('should handle the REQUEST_NOTE_CREATE_SUCCESS', () => {
    expect(
      incidentDetailPageReducer(fromJS({
        incident: {
          notes_count: 666
        },
        incidentNotesList: [],
      }), {
        type: REQUEST_NOTE_CREATE_SUCCESS,
        payload: 'note'
      }).toJS()
    ).toEqual({
      incident: {
        notes_count: 667
      },
      incidentNotesList: ['note']
    });
  });
});
