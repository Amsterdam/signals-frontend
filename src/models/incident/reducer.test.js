import { fromJS } from 'immutable';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';

import { REQUEST_PRIORITY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentPriorityContainer/constants';
import { REQUEST_CATEGORY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentCategoryContainer/constants';
import { REQUEST_STATUS_CREATE_SUCCESS } from 'signals/incident-management/containers/IncidentStatusContainer/constants';
import { SPLIT_INCIDENT_SUCCESS } from 'signals/incident-management/containers/IncidentSplitContainer/constants';

import incidentModelReducer, { initialState } from './reducer';
import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR,
  RESET_SPLIT_STATE
}
  from './constants';

describe('incidentModelReducer', () => {
  const reducer = incidentModelReducer;
  const expected = {
    id: null,
    loading: false,
    error: false,
    split: false,
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

  it('should handle the RESET_SPLIT_STATE', () => {
    const split = { id: 42, created: [{ id: 3 }] };
    expect(
      incidentModelReducer(fromJS({ split }), {
        type: RESET_SPLIT_STATE
      }).toJS()
    ).toEqual({
      split: false
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

  it('should handle the SPLIT_INCIDENT_SUCCESS', () => {
    const payload = { id: 42, created: [{ id: 3 }] };
    expect(
      incidentModelReducer(fromJS({}), {
        type: SPLIT_INCIDENT_SUCCESS,
        payload
      }).toJS()
    ).toEqual({
      split: payload
    });
  });
});
