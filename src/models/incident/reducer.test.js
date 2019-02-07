import { fromJS } from 'immutable';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';

import { REQUEST_PRIORITY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentPriorityContainer/constants';
import { REQUEST_CATEGORY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentCategoryContainer/constants';
import { REQUEST_STATUS_CREATE_SUCCESS } from 'signals/incident-management/containers/IncidentStatusContainer/constants';
import { REQUEST_NOTE_CREATE_SUCCESS } from 'signals/incident-management/containers/IncidentNotesContainer/constants';

import incidentModelReducer, { initialState } from './reducer';
import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR
}
  from './constants';

describe('incidentModelReducer', () => {
  const reducer = incidentModelReducer;
  const expected = {
    id: null,
    loading: false,
    error: false,
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
      incidentModelReducer(undefined, {
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
      incidentModelReducer(undefined, {
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
      incidentModelReducer(undefined, {
        type: REQUEST_INCIDENT_ERROR,
        payload: true
      }).toJS()
    ).toEqual({
      ...expected,
      error: true
    });
  });


  it('should handle the REQUEST_CATEGORY_UPDATE_SUCCESS', () => {
    expect(
      incidentModelReducer(state, {
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
      incidentModelReducer(state, {
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
      incidentModelReducer(state, {
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
      incidentModelReducer(fromJS({
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
