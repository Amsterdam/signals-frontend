import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { takeLatest } from 'redux-saga/effects';

import { resetSearchQuery } from 'models/search/actions';
import {
  authCall,
  authDeleteCall,
  authPatchCall,
  authPostCall,
} from 'shared/services/api/api';
import filterSaga, {
  applyFilter,
  doSaveFilter,
  doUpdateFilter,
  fetchFilters,
  removeFilter,
  requestURL,
  saveFilter,
  updateFilter,
} from '../saga';
import {
  APPLY_FILTER,
  GET_FILTERS,
  REMOVE_FILTER,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  SAVE_FILTER,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER,
} from '../constants';
import {
  filterSaveFailed,
  filterSaveSuccess,
  filterUpdatedFailed,
  filterUpdatedSuccess,
  getFilters,
  getFiltersFailed,
  getFiltersSuccess,
  removeFilterFailed,
  removeFilterSuccess,
} from '../actions';

describe('signals/incident-management/saga', () => {
  it('should watch filterSaga', () => {
    testSaga(filterSaga)
      .next()
      .all([
        takeLatest(GET_FILTERS, fetchFilters),
        takeLatest(REMOVE_FILTER, removeFilter),
        takeLatest(APPLY_FILTER, applyFilter),
        takeLatest(SAVE_FILTER, saveFilter),
        takeLatest(UPDATE_FILTER, updateFilter),
      ])
      .next()
      .isDone();
  });

  it('should dispatch getFiltersSuccess', () => {
    const filters = { results: [{ a: 1 }] };

    testSaga(fetchFilters)
      .next()
      .call(authCall, requestURL)
      .next(filters)
      .put(getFiltersSuccess(filters.results))
      .next()
      .isDone();
  });

  it('should dispatch getFiltersFailed', () => {
    const message = '404 not found';
    const error = new Error(message);

    testSaga(fetchFilters)
      .next()
      .call(authCall, requestURL)
      .throw(error)
      .put(getFiltersFailed(message))
      .next()
      .isDone();
  });

  it('should dispatch removeFilterSuccess', () => {
    const id = 1000;
    const action = { payload: id };

    testSaga(removeFilter, action)
      .next()
      .call(authDeleteCall, `${requestURL}${id}`)
      .next(id)
      .put(removeFilterSuccess(id))
      .next()
      .isDone();
  });

  it('should dispatch removeFilterFailed', () => {
    const id = 1000;
    const action = { payload: id };
    const message = '404 not found';
    const error = new Error(message);

    testSaga(removeFilter, action)
      .next()
      .call(authDeleteCall, `${requestURL}${id}`)
      .throw(error)
      .put(removeFilterFailed(message))
      .next()
      .isDone();
  });

  describe('applyFilter', () => {
    it('should dispatch resetSearchQuery', () => {
      testSaga(applyFilter)
        .next()
        .put(resetSearchQuery())
        .next()
        .isDone();
    });
  });

  describe('doSaveFilter', () => {
    const filterData = {
      name: 'Name of my filter',
      options: {
        maincategory_slug: ['i', 'a', 'o', 'u'],
        address_text: 'Weesperstraat 113-117',
      },
    };

    const { name, options } = filterData;

    const payload = filterData;
    const payloadResponse = {
      ...payload,
      key: 'something',
    };
    const action = {
      type: SAVE_FILTER,
      payload,
    };

    it('should call endpoint with filter data', () => {
      testSaga(doSaveFilter, action)
        .next()
        .put(resetSearchQuery())
        .next()
        .call(authPostCall, requestURL, { name, options })
        .next(payloadResponse)
        .put(filterSaveSuccess(payloadResponse))
        .next()
        .put(getFilters())
        .next()
        .isDone();
    });

    it('should dispatch success', () =>
      expectSaga(doSaveFilter, action)
        .provide([[matchers.call.fn(authPostCall), payloadResponse]])
        .put({
          type: SAVE_FILTER_SUCCESS,
          payload: payloadResponse,
        })
        .run());

    it('should dispatch failed', () =>
      expectSaga(doSaveFilter, {
        payload: { ...payload, name: undefined },
      })
        .put({
          type: SAVE_FILTER_FAILED,
          payload: 'No name supplied',
        })
        .run());

    it('catches anything', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 300,
      };

      testSaga(doSaveFilter, action)
        .next()
        .throw(error)
        .put(filterSaveFailed(error))
        .next()
        .isDone();
    });

    it('catches 400', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 400,
      };

      testSaga(doSaveFilter, action)
        .next()
        .throw(error)
        .put(filterSaveFailed('Invalid data supplied'))
        .next()
        .isDone();
    });

    it('catches 500', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 500,
      };

      testSaga(doSaveFilter, action)
        .next()
        .throw(error)
        .put(filterSaveFailed('Internal server error'))
        .next()
        .isDone();
    });
  });

  describe('doUpdateFilter', () => {
    const updatePayload = {
      id: 1234,
      name: 'Name of my filter',
      options: {
        maincategory_slug: ['i', 'a', 'o', 'u'],
        address_text: 'Weesperstraat 113-117',
      },
      refresh: true,
    };
    const { name, id, refresh, options } = updatePayload;
    const payload = {
      name: 'New name of my filter',
      maincategory_slug: ['i', 'a'],
    };
    const action = {
      type: UPDATE_FILTER,
      payload,
    };

    it('should call endpoint with filter data', () => {
      testSaga(doUpdateFilter, { ...action, payload: updatePayload })
        .next()
        .call(authPatchCall, `${requestURL}${id}`, { name, refresh, options })
        .next(updatePayload)
        .put(filterUpdatedSuccess(updatePayload))
        .next()
        .put(getFilters())
        .next()
        .put(resetSearchQuery())
        .next()
        .isDone();
    });

    it('should dispatch success', () => {
      const payloadResponse = { ...updatePayload, payload };
      return expectSaga(doUpdateFilter, action)
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

      testSaga(doUpdateFilter, action)
        .next()
        .throw(error)
        .put(filterUpdatedFailed(error))
        .next()
        .isDone();
    });

    it('catches 400', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 400,
      };

      testSaga(doUpdateFilter, action)
        .next()
        .throw(error)
        .put(filterUpdatedFailed('Invalid data supplied'))
        .next()
        .isDone();
    });

    it('catches 500', () => {
      const error = new Error('Something bad happened');
      error.response = {
        status: 500,
      };

      testSaga(doUpdateFilter, action)
        .next()
        .throw(error)
        .put(filterUpdatedFailed('Internal server error'))
        .next()
        .isDone();
    });
  });

  describe('saveFilter', () => {
    it('should spawn doSaveFilter', () => {
      const payload = {
        name: 'Name of my filter',
        maincategory_slug: ['i', 'a', 'o', 'u'],
        address_text: 'Weesperstraat 113-117',
      };
      const action = {
        type: SAVE_FILTER,
        payload,
      };

      return expectSaga(saveFilter, action)
        .spawn(doSaveFilter, action)
        .run();
    });
  });

  describe('updateFilter', () => {
    it('should spawn doUpdateFilter', () => {
      const payload = {
        id: 1234,
        name: 'New name of my filter',
        maincategory_slug: ['i', 'a'],
      };
      const action = {
        type: UPDATE_FILTER,
        payload,
      };

      return expectSaga(updateFilter, action)
        .spawn(doUpdateFilter, action)
        .run();
    });
  });
});
