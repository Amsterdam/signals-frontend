// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import invariant from 'invariant'
import isEmpty from 'lodash.isempty'
import isFunction from 'lodash.isfunction'
import isString from 'lodash.isstring'

import checkStore from './checkStore'
import createReducer from '../reducers'

export function injectReducerFactory(store, isValid) {
  return function injectReducer(key, reducer) {
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

export default function getInjectors(store) {
  checkStore(store)

  return {
    injectReducer: injectReducerFactory(store, true),
  }
}
