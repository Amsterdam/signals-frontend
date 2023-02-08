// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { connectRouter } from 'connected-react-router/immutable'
import { combineReducers } from 'redux'

import globalReducer from 'containers/App/reducer'
import history from 'utils/history'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
/* istanbul ignore next */
export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    ...injectedReducers,
  })
}
