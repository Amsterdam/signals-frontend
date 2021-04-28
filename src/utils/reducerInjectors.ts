// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import invariant from 'invariant'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'

import type { InjectedStore } from 'types'
import type { Reducer } from 'redux'
import createReducer from '../reducers'
import checkStore from './checkStore'

export function injectReducerFactory(store: InjectedStore, isValid = false) {
  return function injectReducer<T>(key: string, reducer: Reducer<T>) {
    if (!isValid) checkStore(store)

    invariant(
      isString(key) && !isEmpty(key) && isFunction(reducer),
      '(app/utils...) injectReducer: Expected `reducer` to be a reducer function'
    )

    // Check `store.injectedReducers[key] === reducer` for hot reloading when a key is the same but a reducer is different
    if (
      Reflect.has(store.injectedReducers, key) &&
      store.injectedReducers[key] === reducer
    ) {
      return
    }

    store.injectedReducers[key] = reducer // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.injectedReducers))
  }
}

export function getInjectors(store: InjectedStore) {
  checkStore(store)

  return {
    injectReducer: injectReducerFactory(store, true),
  }
}
