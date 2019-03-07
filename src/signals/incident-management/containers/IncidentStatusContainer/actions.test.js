import { testActionCreator } from 'test/utils';

import {
  REQUEST_STATUS_LIST, REQUEST_STATUS_LIST_SUCCESS, REQUEST_STATUS_LIST_ERROR,
  REQUEST_STATUS_CREATE, REQUEST_STATUS_CREATE_SUCCESS, REQUEST_STATUS_CREATE_ERROR
}
  from './constants';

import {
  requestStatusList, requestStatusListSuccess, requestStatusListError,
  requestStatusCreate, requestStatusCreateSuccess, requestStatusCreateError
} from './actions';


describe('Incident status container actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestStatusList, REQUEST_STATUS_LIST, payload);
    testActionCreator(requestStatusListSuccess, REQUEST_STATUS_LIST_SUCCESS, payload);
    testActionCreator(requestStatusListError, REQUEST_STATUS_LIST_ERROR, payload);
    testActionCreator(requestStatusCreate, REQUEST_STATUS_CREATE, payload);
    testActionCreator(requestStatusCreateSuccess, REQUEST_STATUS_CREATE_SUCCESS, payload);
    testActionCreator(requestStatusCreateError, REQUEST_STATUS_CREATE_ERROR, payload);
  });
});
