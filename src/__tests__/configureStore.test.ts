// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
/**
 * Test store addons
 */
import { composeWithDevTools } from 'redux-devtools-extension'

import configureStore from '../configureStore'
import type { InjectedStore } from '../types'

describe('configureStore', () => {
  let store: InjectedStore

  beforeAll(() => {
    store = configureStore({}).store
  })

  describe('injectedReducers', () => {
    it('should contain an object for reducers', () => {
      expect(typeof store.injectedReducers).toBe('object')
    })
  })

  describe('injectedSagas', () => {
    it('should contain an object for sagas', () => {
      expect(typeof store.injectedSagas).toBe('object')
    })
  })

  describe('runSaga', () => {
    it('should contain a hook for `sagaMiddleware.run`', () => {
      expect(typeof store.runSaga).toBe('function')
    })
  })
})

jest.mock('redux-devtools-extension', () => ({
  composeWithDevTools: jest.fn(),
}))

describe('configureStore params', () => {
  it('should call composeWithDevTools', () => {
    configureStore({})
    expect(composeWithDevTools).toHaveBeenCalled()
  })
})
