import { testActionCreator } from 'test/utils';

import {
  REQUEST_HISTORY_LIST, REQUEST_HISTORY_LIST_SUCCESS, REQUEST_HISTORY_LIST_ERROR,
}
  from './constants';

import {
  requestHistoryList, requestHistoryListSuccess, requestHistoryListError,
} from './actions';

describe('Incident note container actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestHistoryList, REQUEST_HISTORY_LIST, payload);
    testActionCreator(requestHistoryListSuccess, REQUEST_HISTORY_LIST_SUCCESS, payload);
    testActionCreator(requestHistoryListError, REQUEST_HISTORY_LIST_ERROR, payload);
  });
});
