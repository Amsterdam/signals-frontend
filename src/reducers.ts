// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux'

import globalReducer from 'containers/App/reducer'

import { routerReducer } from './utils/reduxHistoryContext'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
/* istanbul ignore next */
export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    global: globalReducer,
    router: routerReducer,
    ...injectedReducers,
  })
}
