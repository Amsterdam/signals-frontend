
import { fromJS } from 'immutable';
import dashboardReducer, { initialState } from './reducer';

import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS,
  REQUEST_DASHBOARD_ERROR
}
  from './constants';

describe('dashboardReducer', () => {
  it('returns the initial state', () => {
    expect(dashboardReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_CATEGORY_UPDATE', () => {
    it('sets loading and error', () => {
      expect(
        dashboardReducer(fromJS({}), {
          type: REQUEST_DASHBOARD
        }).toJS()
      ).toEqual({
        loading: true
      });
    });
  });

  describe('REQUEST_CATEGORY_UPDATE_SUCCESS', () => {
    it('sets loading and error', () => {
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
        firstTime: false,
        dashboard: payload
      });
    });
  });

  describe('REQUEST_CATEGORY_UPDATE_SUCCESS', () => {
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
});
