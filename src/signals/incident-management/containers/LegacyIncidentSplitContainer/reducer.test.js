import { fromJS } from 'immutable';
import incidentSplitContainerReducer, { initialState } from './reducer';
import {
  SPLIT_INCIDENT,
  SPLIT_INCIDENT_SUCCESS,
  SPLIT_INCIDENT_ERROR,
}
  from './constants';

jest.mock('../../definitions/stadsdeelList');

describe('incidentSplitContainerReducer', () => {
  const reducer = incidentSplitContainerReducer;
  const expected = {
    split: false,
    loading: false,
    error: false,
  };

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS(initialState));
  });

  it('should handle the SPLIT_INCIDENT', () => {
    expect(
      incidentSplitContainerReducer(undefined, {
        type: SPLIT_INCIDENT,
      }).toJS()
    ).toEqual({
      ...expected,
      loading: true,
    });
  });

  it('should handle the SPLIT_INCIDENT_SUCCESS', () => {
    const payload = { incident: { id: 42 } };
    expect(
      incidentSplitContainerReducer(undefined, {
        type: SPLIT_INCIDENT_SUCCESS,
        payload,
      }).toJS()
    ).toEqual({
      ...expected,
      split: payload,
    });
  });

  it('should handle the SPLIT_INCIDENT_ERROR', () => {
    const payload = { incident: { id: 42 } };

    expect(
      incidentSplitContainerReducer(undefined, {
        type: SPLIT_INCIDENT_ERROR,
        payload,
      }).toJS()
    ).toEqual({
      ...expected,
      error: payload,
      split: payload,
    });
  });
});
