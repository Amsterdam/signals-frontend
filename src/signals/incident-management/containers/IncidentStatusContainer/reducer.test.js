import { fromJS } from 'immutable';
import incidentStatusContainerReducer, { initialState } from './reducer';

import {
  REQUEST_STATUS_LIST,
  REQUEST_STATUS_LIST_SUCCESS,
  REQUEST_STATUS_LIST_ERROR,

  REQUEST_STATUS_CREATE,
  REQUEST_STATUS_CREATE_SUCCESS,
  REQUEST_STATUS_CREATE_ERROR
}
  from './constants';
import statusList from '../../definitions/statusList';

describe('incidentStatusContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentStatusContainerReducer(undefined, {})).toEqual(fromJS(initialState));
  });

  describe('REQUEST_STATUS_LIST', () => {
    it('resets error and loading', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_LIST
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incidentStatusList: [],
        statusList
      });
    });
  });

  describe('REQUEST_STATUS_LIST_SUCCESS', () => {
    it('sets status list and loading', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_LIST_SUCCESS,
          payload: {
            results: ['status 1', 'status 2']
          }
        }).toJS()
      ).toEqual({
        loading: false,
        incidentStatusList: ['status 1', 'status 2'],
        statusList
      });
    });
  });

  describe('REQUEST_STATUS_LIST_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_LIST_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
        incidentStatusList: [],
        statusList
      });
    });
  });

  describe('REQUEST_STATUS_CREATE', () => {
    it('resets error and loading', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_CREATE
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        incidentStatusList: [],
        statusList
      });
    });
  });

  describe('REQUEST_STATUS_CREATE_SUCCESS', () => {
    it('sets status list and loading', () => {
      expect(
        incidentStatusContainerReducer(fromJS({
          incidentStatusList: ['status 1', 'status 2']
        }), {
          type: REQUEST_STATUS_CREATE_SUCCESS,
          payload: 'status 3'
        }).toJS()
      ).toEqual({
        loading: false,
        incidentStatusList: ['status 1', 'status 2', 'status 3']
      });
    });
  });

  describe('REQUEST_STATUS_CREATE_ERROR', () => {
    it('sets error and loading', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_CREATE_ERROR,
          payload: true
        }).toJS()
      ).toEqual({
        error: true,
        loading: false,
        incidentStatusList: [],
        statusList
      });
    });
  });
});
