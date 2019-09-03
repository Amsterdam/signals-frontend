import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { takeLatest } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';

import { authPostCall, authPatchCall } from 'shared/services/api/api';
import filterSaga, { saveFilter, updateFilter, requestURL } from '../saga';
import {
  SAVE_FILTER_SUCCESS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER,
  UPDATE_FILTER,
  UPDATE_FILTER_SUCCESS,
} from '../constants';
import { filterSaveFailed, filterUpdatedFailed } from '../actions';

describe('models/filter/saga', () => {
  it('should watch filterSaga', () => {
    testSaga(filterSaga)
      .next()
      .all([
        takeLatest(SAVE_FILTER, saveFilter),
        takeLatest(UPDATE_FILTER, updateFilter),
      ])
      .next()
      .isDone();
  });

  describe('saveFilter', () => {
    const payload = {
      name: 'Name of my filter',
      maincategory_slug: ['i', 'a', 'o', 'u'],
      address_text: 'Weesperstraat 113-117',
    };
    const payloadResponse = {
      ...payload,
      key: 'something',
    };
    const action = {
      type: SAVE_FILTER,
      payload,
    };

    it('should call endpoint with filter data', () => {
      expectSaga(saveFilter, action)
        .provide([[matchers.call.fn(requestURL)]])
        .call(authPostCall, requestURL, payload)
        .run();
    });

    it('should dispatch success', () => {
      expectSaga(saveFilter, action)
        .provide([[matchers.call.fn(authPostCall), payloadResponse]])
        .put({
          type: SAVE_FILTER_SUCCESS,
          payload: payloadResponse,
        })
        .run();
    });

    it('should dispatch failed', () => {
      expectSaga(saveFilter, { payload: { ...payload, name: undefined } })
        .put({
          type: SAVE_FILTER_FAILED,
          payload: 'No name supplied',
        })
        .run();
    });

    it('catches anything', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 300,
      };

      expectSaga(saveFilter, action)
        .provide([[matchers.call.fn(requestURL), throwError(error)]])
        .put(filterSaveFailed(error))
        .run();
    });

    it('catches 400', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 400,
      };

      expectSaga(saveFilter, action)
        .provide([[matchers.call.fn(requestURL), throwError(error)]])
        .put(filterSaveFailed('Invalid data supplied'))
        .run();
    });

    it('catches 500', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 500,
      };

      expectSaga(saveFilter, action)
        .provide([[matchers.call.fn(requestURL), throwError(error)]])
        .put(filterSaveFailed('Internal server error'))
        .run();
    });
  });

  describe('updateFilter', () => {
    const savePayload = {
      name: 'Name of my filter',
      maincategory_slug: ['i', 'a', 'o', 'u'],
      address_text: 'Weesperstraat 113-117',
    };
    const payload = {
      name: 'New name of my filter',
      maincategory_slug: ['i', 'a'],
    };
    const action = {
      type: UPDATE_FILTER,
      payload,
    };

    it('should call endpoint with filter data', () => {
      expectSaga(updateFilter, action)
        .provide([[matchers.call.fn(requestURL)]])
        .call(authPatchCall, requestURL, payload)
        .run();
    });

    it('should dispatch success', () => {
      const payloadResponse = { ...savePayload, payload };
      expectSaga(updateFilter, action)
        .provide([[matchers.call.fn(authPatchCall), payloadResponse]])
        .put({
          type: UPDATE_FILTER_SUCCESS,
          payload: payloadResponse,
        })
        .run();
    });

    it('catches anything', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 300,
      };

      expectSaga(updateFilter, action)
        .provide([[matchers.call.fn(requestURL), throwError(error)]])
        .put(filterUpdatedFailed(error))
        .run();
    });

    it('catches 400', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 400,
      };

      expectSaga(updateFilter, action)
        .provide([[matchers.call.fn(requestURL), throwError(error)]])
        .put(filterSaveFailed('Invalid data supplied'))
        .run();
    });

    it('catches 500', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 500,
      };

      expectSaga(updateFilter, action)
        .provide([[matchers.call.fn(requestURL), throwError(error)]])
        .put(filterSaveFailed('Internal server error'))
        .run();
    });
  });
});
