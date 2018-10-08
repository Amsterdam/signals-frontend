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
        loadingExternal: false,
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
        loadingExternal: false,
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
        loadingExternal: false,
        incidentStatusList: [],
        statusList
      });
    });
  });

  describe('REQUEST_STATUS_CREATE', () => {
    it('resets error and loading', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_CREATE,
          payload: {
            state: 's'
          }
        }).toJS()
      ).toEqual({
        error: false,
        loading: true,
        loadingExternal: false,
        incidentStatusList: [],
        statusList
      });
    });

    it('resets error and loadingExternal', () => {
      expect(
        incidentStatusContainerReducer(undefined, {
          type: REQUEST_STATUS_CREATE,
          payload: {
            target_api: 'sigmax'
          }
        }).toJS()
      ).toEqual({
        error: false,
        loading: false,
        loadingExternal: true,
        incidentStatusList: [],
        statusList
      });
    });
  });

  describe('REQUEST_STATUS_CREATE_SUCCESS', () => {
    it('sets status list and loading', () => {
      expect(
        incidentStatusContainerReducer(fromJS({
          incidentStatusList: [{ text: 'status 1' }, { text: 'status 2' }]
        }), {
          type: REQUEST_STATUS_CREATE_SUCCESS,
          payload: { text: 'status 3' }
        }).toJS()
      ).toEqual({
        loading: false,
        incidentStatusList: [{ text: 'status 1' }, { text: 'status 2' }, { text: 'status 3' }]
      });
    });

    it('sets status list and loadingExternal', () => {
      expect(
        incidentStatusContainerReducer(fromJS({
          incidentStatusList: [{ text: 'status 1' }, { text: 'status 2' }]
        }), {
          type: REQUEST_STATUS_CREATE_SUCCESS,
          payload: { text: 'status 3', target_api: 'sigmax' }
        }).toJS()
      ).toEqual({
        loadingExternal: false,
        incidentStatusList: [{ text: 'status 1' }, { text: 'status 2' }, { text: 'status 3', target_api: 'sigmax' }]
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
        loadingExternal: false,
        incidentStatusList: [],
        statusList
      });
    });
  });
});
