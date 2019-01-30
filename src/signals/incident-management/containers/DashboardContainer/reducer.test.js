
import { fromJS } from 'immutable';
import dashboardReducer, { initialState } from './reducer';

import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS,
  REQUEST_DASHBOARD_ERROR,
  UPDATE_DASHBOARD
}
  from './constants';

describe('dashboardReducer', () => {
  it('returns the initial state', () => {
    expect(dashboardReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_DASHBOARD', () => {
    it('sets loading', () => {
      expect(
        dashboardReducer(fromJS({}), {
          type: REQUEST_DASHBOARD
        }).toJS()
      ).toEqual({
        loading: true
      });
    });
  });

  describe('REQUEST_DASHBOARD_SUCCESS', () => {
    it('sets loading and dashboard', () => {
      const payload = {
        status: [],
        categorie: [],
        hour: [],
        today: {}
      };
      expect(
        dashboardReducer(fromJS({}), {
          type: REQUEST_DASHBOARD_SUCCESS,
          payload
        }).toJS()
      ).toEqual({
        loading: false,
        dashboard: payload
      });
    });
  });

  describe('REQUEST_DASHBOARD_ERROR', () => {
    it('sets loading and error', () => {
      expect(
        dashboardReducer(fromJS({}), {
          type: REQUEST_DASHBOARD_ERROR
        }).toJS()
      ).toEqual({
        loading: false,
        error: true
      });
    });
  });

  describe('UPDATE_DASHBOARD', () => {
    it('not sets loading and error', () => {
      expect(
        dashboardReducer(fromJS({}), {
          type: UPDATE_DASHBOARD
        }).toJS()
      ).toEqual({});
    });
  });
});
