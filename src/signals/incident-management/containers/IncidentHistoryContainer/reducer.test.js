import { fromJS } from 'immutable';
import incidentHistoryContainerReducer, { initialState } from './reducer';

import {
  REQUEST_HISTORY_LIST,
  REQUEST_HISTORY_LIST_SUCCESS,
  REQUEST_HISTORY_LIST_ERROR
}
  from './constants';

describe('incidentHistoryContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentHistoryContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_HISTORY_LIST', () => {
    it('resets error and loading', () => {
      expect(
        incidentHistoryContainerReducer(undefined, {
          type: REQUEST_HISTORY_LIST
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incidentHistoryList: []
      });
    });
  });

  describe('REQUEST_HISTORY_LIST_SUCCESS', () => {
    it('sets history list and loading', () => {
      expect(
        incidentHistoryContainerReducer(undefined, {
          type: REQUEST_HISTORY_LIST_SUCCESS,
          payload: {
            results: ['Note 1', 'Note 2']
          }
        }).toJS()
      ).toEqual({
        loading: false,
        incidentHistoryList: ['Note 1', 'Note 2']
      });
    });
  });

  describe('REQUEST_HISTORY_LIST_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentHistoryContainerReducer(undefined, {
          type: REQUEST_HISTORY_LIST_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
        incidentHistoryList: []
      });
    });
  });
});
