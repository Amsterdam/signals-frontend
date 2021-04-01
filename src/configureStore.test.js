// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { browserHistory } from 'react-router-dom';
import Immutable from 'immutable';

import { SHOW_GLOBAL_NOTIFICATION } from 'containers/App/constants';
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants';
import configureStore from './configureStore';

describe('configureStore', () => {
  let store;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
  });

  describe('injectedReducers', () => {
    it('should contain an object for reducers', () => {
      expect(typeof store.injectedReducers).toBe('object');
    });
  });

  describe('injectedSagas', () => {
    it('should contain an object for sagas', () => {
      expect(typeof store.injectedSagas).toBe('object');
    });
  });

  describe('runSaga', () => {
    it('should contain a hook for `sagaMiddleware.run`', () => {
      expect(typeof store.runSaga).toBe('function');
    });

    it('should catch errors thrown from sagas', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const title = 'Whoopsie';
      const error = new Error(title);

      function* someGenerator() {
        throw error;
      }

      expect(dispatchSpy).not.toHaveBeenCalled();

      store.runSaga(someGenerator);

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: {
            message: expect.any(String),
            title: expect.any(String),
            variant: VARIANT_ERROR,
            type: TYPE_GLOBAL,
          },
          type: SHOW_GLOBAL_NOTIFICATION,
        })
      );
    });
  });
});

describe('configureStore params', () => {
  it('should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__', () => {
    /* eslint-disable no-underscore-dangle */
    const compose = jest.fn();
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = () => compose;
    configureStore(undefined, browserHistory);
    expect(compose).toHaveBeenCalled();
    /* eslint-enable */
  });
});
