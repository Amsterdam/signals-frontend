import { testActionCreator } from 'test/utils';

import {
  REQUEST_CATEGORY_UPDATE, REQUEST_CATEGORY_UPDATE_SUCCESS, REQUEST_CATEGORY_UPDATE_ERROR
}
  from './constants';

import {
  requestCategoryUpdate, requestCategoryUpdateSuccess, requestCategoryUpdateError
} from './actions';


describe('Incident edit actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestCategoryUpdate, REQUEST_CATEGORY_UPDATE, payload);
    testActionCreator(requestCategoryUpdateSuccess, REQUEST_CATEGORY_UPDATE_SUCCESS, payload);
    testActionCreator(requestCategoryUpdateError, REQUEST_CATEGORY_UPDATE_ERROR, payload);
  });
});
