import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@datapunt/asc-ui';

import configureStore from '../configureStore';

const history = createBrowserHistory();

export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload,
  };
  expect(action(payload)).toEqual(expected);
};

export const getContext = (state) => {
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

export const withAppContext = (Component) => (
  <ThemeProvider>
    <Provider store={configureStore({}, history)}>
      <ConnectedRouter history={history}>
        {Component}
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
);
