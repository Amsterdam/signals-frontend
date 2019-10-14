import { fromJS } from 'immutable';

import stadsdeelList from 'signals/incident-management/definitions/stadsdeelList';
import priorityList from 'signals/incident-management/definitions/priorityList';
import statusList, { changeStatusOptionList } from 'signals/incident-management/definitions/statusList';

import { SPLIT_INCIDENT_SUCCESS } from 'signals/incident-management/containers/IncidentSplitContainer/constants';

import incidentModelReducer, { initialState } from './reducer';
import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  DISMISS_SPLIT_NOTIFICATION,
  PATCH_INCIDENT, PATCH_INCIDENT_SUCCESS, PATCH_INCIDENT_ERROR,
  REQUEST_ATTACHMENTS, REQUEST_ATTACHMENTS_SUCCESS, REQUEST_ATTACHMENTS_ERROR, DISMISS_ERROR,
  REQUEST_DEFAULT_TEXTS, REQUEST_DEFAULT_TEXTS_SUCCESS, REQUEST_DEFAULT_TEXTS_ERROR
}
  from './constants';

describe('incidentModelReducer', () => {
  const reducer = incidentModelReducer;
  const expected = {
    id: null,
    stadsdeelList,
    priorityList,
    changeStatusOptionList,
    statusList,
    loading: false,
    error: false,
    attachments: [],
    patching: {
      location: false,
      notes: false,
      priority: false,
      status: false,
      subcategory: false
    },
    split: false
  };
  // let state;

  beforeEach(() => {
    // state = fromJS({
      // incident: {},
      // incidentNotesList: [],
    // });
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
      patching: {
        ...expected.patching,
        location: true
      }
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
      patching: {
        ...expected.patching
      }
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
      patching: {
        ...expected.patching
      },
      error: payload.error
    });
  });

  it('should handle the DISMISS_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: DISMISS_ERROR
      }).toJS()
    ).toEqual({
      ...expected,
      error: false
    });
  });

  it('should handle the REQUEST_ATTACHMENTS', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_ATTACHMENTS,
        payload: 42
      }).toJS()
    ).toEqual({
      ...expected,
      attachments: []
    });
  });

  it('should handle the REQUEST_ATTACHMENTS_SUCCESS', () => {
    const payload = [{ file: 1 }, { image: 2 }];
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_ATTACHMENTS_SUCCESS,
        payload
      }).toJS()
    ).toEqual({
      ...expected,
      attachments: payload
    });
  });

  it('should handle the REQUEST_ATTACHMENTS_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_ATTACHMENTS_ERROR
      }).toJS()
    ).toEqual({
      ...expected,
      attachments: []
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

  it('should handle the REQUEST_DEFAULT_TEXTS', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_DEFAULT_TEXTS,
        payload: 42
      }).toJS()
    ).toEqual({
      ...expected,
      defaultTexts: []
    });
  });

  it('should handle the REQUEST_DEFAULT_TEXTS_SUCCESS', () => {
    const payload = [{ file: 1 }, { image: 2 }];
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_DEFAULT_TEXTS_SUCCESS,
        payload
      }).toJS()
    ).toEqual({
      ...expected,
      defaultTexts: payload
    });
  });

  it('should handle the REQUEST_DEFAULT_TEXTS_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_DEFAULT_TEXTS_ERROR
      }).toJS()
    ).toEqual({
      ...expected,
      defaultTexts: []
    });
  });
});
