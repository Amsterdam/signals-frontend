import { testActionCreator } from '../../../../../internals/testing/test-utils';

import {
  REQUEST_PRIORITY_UPDATE, REQUEST_PRIORITY_UPDATE_SUCCESS, REQUEST_PRIORITY_UPDATE_ERROR
}
  from './constants';

import {
  requestPriorityUpdate, requestPriorityUpdateSuccess, requestPriorityUpdateError
} from './actions';


describe('Incident edit actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestPriorityUpdate, REQUEST_PRIORITY_UPDATE, payload);
    testActionCreator(requestPriorityUpdateSuccess, REQUEST_PRIORITY_UPDATE_SUCCESS, payload);
    testActionCreator(requestPriorityUpdateError, REQUEST_PRIORITY_UPDATE_ERROR, payload);
  });
});
