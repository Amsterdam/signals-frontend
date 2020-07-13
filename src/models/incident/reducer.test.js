import incidentModelReducer, { initialState } from './reducer';
import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  REQUEST_ATTACHMENTS, REQUEST_ATTACHMENTS_SUCCESS, REQUEST_ATTACHMENTS_ERROR, DISMISS_ERROR,
  REQUEST_DEFAULT_TEXTS, REQUEST_DEFAULT_TEXTS_SUCCESS, REQUEST_DEFAULT_TEXTS_ERROR,
}
  from './constants';

describe('models/incident/reducer', () => {
  const reducer = incidentModelReducer;

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the REQUEST_INCIDENT', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_INCIDENT,
        payload: 42,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      id: 42,
      incident: null,
      loading: true,
    });
  });

  it('should handle the REQUEST_INCIDENT_SUCCESS', () => {
    const payload = { id: 1 };
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_INCIDENT_SUCCESS,
        payload,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      incident: {
        id: 1,
      },
    });
  });

  it('should handle the REQUEST_INCIDENT_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_INCIDENT_ERROR,
        payload: true,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      error: true,
    });
  });

  it('should handle the DISMISS_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: DISMISS_ERROR,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      error: false,
    });
  });

  it('should handle the REQUEST_ATTACHMENTS', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_ATTACHMENTS,
        payload: 42,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      attachments: [],
    });
  });

  it('should handle the REQUEST_ATTACHMENTS_SUCCESS', () => {
    const payload = [{ file: 1 }, { image: 2 }];
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_ATTACHMENTS_SUCCESS,
        payload,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      attachments: payload,
    });
  });

  it('should handle the REQUEST_ATTACHMENTS_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_ATTACHMENTS_ERROR,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      attachments: [],
    });
  });

  it('should handle the REQUEST_DEFAULT_TEXTS', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_DEFAULT_TEXTS,
        payload: 42,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      defaultTexts: [],
    });
  });

  it('should handle the REQUEST_DEFAULT_TEXTS_SUCCESS', () => {
    const payload = [{ file: 1 }, { image: 2 }];
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_DEFAULT_TEXTS_SUCCESS,
        payload,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      defaultTexts: payload,
    });
  });

  it('should handle the REQUEST_DEFAULT_TEXTS_ERROR', () => {
    expect(
      incidentModelReducer(undefined, {
        type: REQUEST_DEFAULT_TEXTS_ERROR,
      }).toJS()
    ).toEqual({
      ...initialState.toJS(),
      defaultTexts: [],
    });
  });
});
