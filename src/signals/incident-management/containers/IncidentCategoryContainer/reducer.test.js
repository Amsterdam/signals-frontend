
import { fromJS } from 'immutable';
import incidentStatusContainerReducer, { initialState } from './reducer';

import {
  REQUEST_CATEGORY_UPDATE,
  REQUEST_CATEGORY_UPDATE_SUCCESS,
  REQUEST_CATEGORY_UPDATE_ERROR
}
  from './constants';

describe('indcidentEditContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentStatusContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_CATEGORY_UPDATE', () => {
    it('sets loading and error', () => {
      expect(
        incidentStatusContainerReducer(fromJS({}), {
          type: REQUEST_CATEGORY_UPDATE,
          payload: 'Overlast op land'
        }).toJS()
      ).toEqual({
        error: false,
        loading: true
      });
    });
  });

  describe('REQUEST_CATEGORY_UPDATE_SUCCESS', () => {
    it('sets loading and error', () => {
      expect(
        incidentStatusContainerReducer(fromJS({}), {
          type: REQUEST_CATEGORY_UPDATE_SUCCESS,
          payload: 'Overlast op land'
        }).toJS()
      ).toEqual({
        loading: false
      });
    });
  });

  describe('REQUEST_CATEGORY_UPDATE_ERROR', () => {
    it('sets loading and error', () => {
      expect(
        incidentStatusContainerReducer(fromJS({}), {
          type: REQUEST_CATEGORY_UPDATE_ERROR,
          payload: { error: 666 }
        }).toJS()
      ).toEqual({
        error: { error: 666 },
        loading: false
      });
    });
  });
});
