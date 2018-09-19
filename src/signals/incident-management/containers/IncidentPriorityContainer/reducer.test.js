
import { fromJS } from 'immutable';
import incidentStatusContainerReducer, { initialState } from './reducer';

import {
  REQUEST_PRIORITY_UPDATE,
  REQUEST_PRIORITY_UPDATE_SUCCESS,
  REQUEST_PRIORITY_UPDATE_ERROR
}
  from './constants';

describe('indcidentEditContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentStatusContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_PRIORITY_UPDATE', () => {
    it('sets loading and error', () => {
      expect(
        incidentStatusContainerReducer(fromJS({}), {
          type: REQUEST_PRIORITY_UPDATE,
          payload: 'Overlast op land'
        }).toJS()
      ).toEqual({
        error: false,
        loading: true
      });
    });
  });

  describe('REQUEST_PRIORITY_UPDATE_SUCCESS', () => {
    it('sets loading and error', () => {
      expect(
        incidentStatusContainerReducer(fromJS({}), {
          type: REQUEST_PRIORITY_UPDATE_SUCCESS,
          payload: 'Overlast op land'
        }).toJS()
      ).toEqual({
        loading: false
      });
    });
  });

  describe('REQUEST_PRIORITY_UPDATE_ERROR', () => {
    it('sets loading and error', () => {
      expect(
        incidentStatusContainerReducer(fromJS({}), {
          type: REQUEST_PRIORITY_UPDATE_ERROR,
          payload: { error: 666 }
        }).toJS()
      ).toEqual({
        error: { error: 666 },
        loading: false
      });
    });
  });
});
