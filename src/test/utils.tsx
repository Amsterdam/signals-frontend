// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { ConnectedRouter } from 'connected-react-router/immutable'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@amsterdam/asc-ui'
import MatchMediaMock from 'match-media-mock'
import isObject from 'lodash.isobject'
import usersJSON from 'utils/__tests__/fixtures/users.json'
import loadModels from 'models'
import MapContext from 'containers/MapContext'
import type { ReactNode } from 'react'

import configureStore from '../configureStore'

export const history = createMemoryHistory()

// set a default screenwidth of 2560 pixels
const mmm = MatchMediaMock.create()

mmm.setConfig({ type: 'screen', width: 2560 })

// eslint-disable-next-line no-undef
Object.defineProperty(global.window, 'matchMedia', {
  value: mmm,
  writable: true,
})

export const testActionCreator = (
  action: (payload: any) => { type: string; payload?: any },
  actionType: string,
  payload?: any
) => {
  const expected = {
    type: actionType,
    payload,
  }
  expect(action(payload)).toEqual(expected)
}

export const getContext = (state: any) => {
  const store = {
    dispatch: jest.fn(),
    getState: () => state,
    replaceReducer: jest.fn(),
    runSaga: jest.fn(),
    subscribe: jest.fn(),
    injectedReducers: {},
    injectedSagas: {},
  }

  return { store }
}

export const store = configureStore({}, history)

loadModels(store)

export const withAppContext = (Component: ReactNode) => (
  <ThemeProvider>
    <Provider store={store}>
      <ConnectedRouter history={history}>{Component}</ConnectedRouter>
    </Provider>
  </ThemeProvider>
)

// eslint-disable-next-line
export const withCustomAppContext = (Component: ReactNode) => ({
  themeCfg = {},
  storeCfg = {},
  routerCfg = {},
}) => (
  <ThemeProvider {...themeCfg}>
    <Provider store={store} {...storeCfg}>
      <ConnectedRouter history={history} {...routerCfg}>
        {Component}
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>
)

/**
 * Get a list of users from JSON data that is coming from the API endpoint
 * Invalid keys are filtered out of the return value.
 */
export const userObjects = (users = usersJSON) =>
  users.results.map((item) =>
    Object.keys(item)
      .filter((key) => !key.startsWith('_'))
      .filter((key) => !isObject((item as any)[key]))
      .reduce((rawObj, key) => {
        const obj: any = { ...rawObj }

        obj[key] = (item as any)[key]

        return obj
      }, {})
  )

export const withMapContext = (Component: ReactNode) =>
  withAppContext(<MapContext>{Component}</MapContext>)
