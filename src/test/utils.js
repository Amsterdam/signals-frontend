import React from 'react';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@datapunt/asc-ui';
import MatchMediaMock from 'match-media-mock';
import Immutable from 'immutable';
import isObject from 'lodash.isobject';
import usersJSON from 'utils/__tests__/fixtures/users.json';
import loadModels from 'models';
import MapContext from 'containers/MapContext';

import configureStore from '../configureStore';

export const history = createMemoryHistory();

// set a default screenwidth of 2560 pixels
const mmm = MatchMediaMock.create();

mmm.setConfig({ type: 'screen', width: 2560 });

// eslint-disable-next-line no-undef
Object.defineProperty(global.window, 'matchMedia', {
  value: mmm,
  writable: true,
});

export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload,
  };
  expect(action(payload)).toEqual(expected);
};

export const getContext = state => {
  const store = {
    dispatch: jest.fn(),
    getState: () => state,
    replaceReducer: jest.fn(),
    runSaga: jest.fn(),
    subscribe: jest.fn(),
    injectedReducers: {},
    injectedSagas: {},
  };

  return { store };
};

export const store = configureStore(Immutable.Map(), history);

loadModels(store);

export const withAppContext = Component => (
  <ThemeProvider>
    <Provider store={store}>
      <ConnectedRouter history={history}>{Component}</ConnectedRouter>
    </Provider>
  </ThemeProvider>
);

// eslint-disable-next-line
export const withCustomAppContext = Component => ({ themeCfg = {}, storeCfg = {}, routerCfg = {} }) => (
  <ThemeProvider {...themeCfg}>
    <Provider store={store} {...storeCfg}>
      <ConnectedRouter history={history} {...routerCfg}>
        {Component}
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
);

/**
 * Get a list of users from JSON data that is coming from the API endpoint
 * Invalid keys are filtered out of the return value.
 *
 * @param {Object} users
 */
export const userObjects = (users = usersJSON) =>
  users.results.map(item =>
    Object.keys(item)
      .filter(key => !key.startsWith('_'))
      .filter(key => !isObject(item[key]))
      .reduce((rawObj, key) => {
        const obj = { ...rawObj };

        obj[key] = item[key];

        return obj;
      }, {})
  );

/**
 * Timeboxed promise resolver
 *
 * Particularly useful when when functionality that is debounced with lodash.debounce
 *
 * @param {Number} timeMs
 * @returns {Promise} Resolved promise
 */
export const resolveAfterMs = timeMs => new Promise(resolve => setTimeout(resolve, timeMs));


export const withMapContext = Component => withAppContext(<MapContext>{Component}</MapContext>);
