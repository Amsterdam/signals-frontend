import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from '../configureStore';

const history = createMemoryHistory();

export const testActionCreator = (action, actionType, payload) => {
  const expected = {
    type: actionType,
    payload
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
    injectedSagas: {}
  };

  return { store };
};

const store = configureStore({}, history);

export const withAppContext = (Component) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {Component}
    </ConnectedRouter>
  </Provider>
);
