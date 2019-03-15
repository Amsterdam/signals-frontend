import { fromJS } from 'immutable';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';

import { REQUEST_PRIORITY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentPriorityContainer/constants';
import { REQUEST_CATEGORY_UPDATE_SUCCESS } from 'signals/incident-management/containers/IncidentCategoryContainer/constants';
import { REQUEST_STATUS_CREATE_SUCCESS } from 'signals/incident-management/containers/IncidentStatusContainer/constants';
import { SPLIT_INCIDENT_SUCCESS } from 'signals/incident-management/containers/IncidentSplitContainer/constants';

import incidentModelReducer, { initialState } from './reducer';
import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  DISMISS_SPLIT_NOTIFICATION,
  PATCH_INCIDENT, PATCH_INCIDENT_SUCCESS, PATCH_INCIDENT_ERROR
}
  from './constants';

describe.only('incidentModelReducer', () => {
  const reducer = incidentModelReducer;
  const expected = {
    id: null,
    loading: false,
    error: false,
    patching: {
      location: false
    },
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

  it('should handle the DISMISS_SPLIT_NOTIFICATION', () => {
    const split = { id: 42, created: [{ id: 3 }] };
    expect(
      incidentModelReducer(fromJS({ split }), {
        type: DISMISS_SPLIT_NOTIFICATION
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

  it('should handle the PATCH_INCIDENT', () => {
    const payload = {
      id: 42,
      type: 'location',
      patch: {
        location: { foo: 'bar' }
      }
    };
    expect(
      incidentModelReducer(undefined, {
        type: PATCH_INCIDENT,
        payload
      }).toJS()
    ).toEqual({
      ...expected,
      patching: { location: true }
    });
  });

  it('should handle the PATCH_INCIDENT_SUCCESS', () => {
    const payload = {
      id: 1,
      type: 'location',
    };
    expect(
      incidentModelReducer(undefined, {
        type: PATCH_INCIDENT_SUCCESS,
        payload
      }).toJS()
    ).toEqual({
      ...expected,
      patching: { location: false }
    });
  });

  it('should handle the PATCH_INCIDENT_ERROR', () => {
    const payload = {
      error: { response: {} },
      type: 'location'
    };
    expect(
     incidentModelReducer(undefined, {
       type: PATCH_INCIDENT_ERROR,
       payload
     }).toJS()
    ).toEqual({
      ...expected,
      patching: { location: false },
      error: payload.error
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

  it('should handle the SPLIT_INCIDENT_SUCCESS ', () => {
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
