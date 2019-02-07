import { fromJS } from 'immutable';
import incidentSplitContainerReducer, { initialState } from './reducer';
import {
  // SPLIT_INCIDENT,
  // REQUEST_INCIDENT_SUCCESS,
  // REQUEST_INCIDENT_ERROR
}
  from './constants';

jest.mock('../../definitions/stadsdeelList');

describe('incidentSplitContainerReducer', () => {
  const reducer = incidentSplitContainerReducer;
  // const expected = {
  //   id: null,
  //   loading: false,
  //   error: false
  // };

  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(fromJS(initialState));
  });

  // it('should handle the SPLIT_INCIDENT', () => {
  //   expect(
  //     incidentSplitContainerReducer(undefined, {
  //       type: SPLIT_INCIDENT,
  //       payload: 42
  //     }).toJS()
  //   ).toEqual({
  //     ...expected,
  //     id: 42,
  //     loading: true
  //   });
  // });

  // it('should handle the REQUEST_INCIDENT_SUCCESS', () => {
  //   const payload = { id: 1 };
  //   expect(
  //     incidentSplitContainerReducer(undefined, {
  //       type: REQUEST_INCIDENT_SUCCESS,
  //       payload
  //     }).toJS()
  //   ).toEqual({
  //     ...expected,
  //     incident: {
  //       id: 1
  //     }
  //   });
  // });

  // it('should handle the REQUEST_INCIDENT_ERROR', () => {
  //   expect(
  //     incidentSplitContainerReducer(undefined, {
  //       type: REQUEST_INCIDENT_ERROR,
  //       payload: true
  //     }).toJS()
  //   ).toEqual({
  //     ...expected,
  //     error: true
  //   });
  // });
});
