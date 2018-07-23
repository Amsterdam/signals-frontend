
import { fromJS } from 'immutable';
import incidentDetailPageReducer, { initialState } from './reducer';

import { requestIncident, requestIncidentSuccess, requestIncidentError } from './actions';
import { requestCategoryUpdateSuccess } from '../IncidentCategoryContainer/actions';
import { requestStatusCreateSuccess } from '../IncidentStatusContainer/actions';
import stadsdeelList from '../../definitions/stadsdeelList';

jest.mock('../../definitions/stadsdeelList');

describe('incidentDetailPageReducer', () => {
  const reducer = incidentDetailPageReducer;
  let state;

  beforeEach(() => {
    state = fromJS();
  });

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS(initialState));
  });

  it('should handle the REQUEST_INCIDENT', () => {
    const action = requestIncident(1);
    const expected = {
      id: 1,
      loading: true,
      error: false,
      stadsdeelList
    };
    expect(reducer(initialState, action)).toEqual(fromJS(expected));
  });

  it('should handle the REQUEST_INCIDENT_SUCCESS', () => {
    const payload = { id: 1 };
    const action = requestIncidentSuccess(payload);
    const expected = fromJS(initialState)
      .set('incident', payload)
      .set('loading', false);
    expect(reducer(initialState, action)).toEqual(expected);
  });

  it('should handle the REQUEST_INCIDENT_ERROR', () => {
    const message = '';
    const action = requestIncidentError(message);
    const expected = fromJS(initialState)
      .set('error', message)
      .set('loading', false);
    expect(reducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_CATEGORY_UPDATE_SUCCESS', () => {
    const category = 'test';
    const action = requestCategoryUpdateSuccess(category);
    const expected = fromJS(initialState)
      .set('incident', { category });
    expect(reducer(state, action)).toEqual(expected);
  });

  it('should handle the REQUEST_STATUS_CREATE_SUCCESS', () => {
    const status = 'test';
    const action = requestStatusCreateSuccess(status);
    const expected = fromJS(initialState)
      .set('incident', { status });
    expect(reducer(state, action)).toEqual(expected);
  });
});
