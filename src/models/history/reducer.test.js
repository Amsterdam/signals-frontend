// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable';
import historyReducer, { initialState } from './reducer';

import {
  REQUEST_HISTORY_LIST,
  REQUEST_HISTORY_LIST_SUCCESS,
  REQUEST_HISTORY_LIST_ERROR,
}
  from './constants';

describe('historyReducer', () => {
  it('returns the initial state', () => {
    expect(historyReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_HISTORY_LIST', () => {
    it('resets error and loading', () => {
      expect(
        historyReducer(undefined, {
          type: REQUEST_HISTORY_LIST,
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        list: [],
      });
    });
  });

  describe('REQUEST_HISTORY_LIST_SUCCESS', () => {
    it('sets history list and loading', () => {
      expect(
        historyReducer(undefined, {
          type: REQUEST_HISTORY_LIST_SUCCESS,
          payload: ['history 1', 'history 2'],
        }).toJS()
      ).toEqual({
        loading: false,
        list: ['history 1', 'history 2'],
      });
    });
  });

  describe('REQUEST_HISTORY_LIST_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        historyReducer(undefined, {
          type: REQUEST_HISTORY_LIST_ERROR,
          payload: true,
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
        list: [],
      });
    });
  });
});
