// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/**
 * Test injectors
 */

import type { Action, Dispatch } from 'redux'
import type { InjectedStore } from 'types'
import checkStore from '../utils/checkStore'

const action: Action<number> = {
  type: 10,
}

const dispatch: Dispatch<typeof action> = (param) => param
describe('checkStore', () => {
  let store: Pick<
    InjectedStore,
    | 'dispatch'
    | 'getState'
    | 'injectedReducers'
    | 'injectedSagas'
    | 'replaceReducer'
    | 'runSaga'
    | 'subscribe'
  >

  beforeEach(() => {
    store = {
      dispatch,
      subscribe: () => () => {},
      getState: () => {},
      replaceReducer: () => {},
      runSaga: () => {},
      injectedReducers: {},
      injectedSagas: {},
    }
  })

  it('should not throw if passed valid store shape', () => {
    expect(() => checkStore(store)).not.toThrow()
  })

  it('should throw if passed invalid store shape', () => {
    expect(() => checkStore({})).toThrow()
    expect(() => checkStore({ ...store, injectedSagas: undefined })).toThrow()
    expect(() =>
      checkStore({ ...store, injectedReducers: undefined })
    ).toThrow()
    expect(() => checkStore({ ...store, runSaga: undefined })).toThrow()
    expect(() => checkStore({ ...store, replaceReducer: undefined })).toThrow()
  })
})
