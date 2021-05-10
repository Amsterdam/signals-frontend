// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router/immutable'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_GLOBAL } from 'containers/Notification/constants'
import { getErrorMessage } from 'shared/services/api/api'

import type { History } from 'history'
import type { InjectedStore } from 'types'
import type { ResponseError } from 'utils/request'
import createReducer from './reducers'

export default function configureStore(
  initialState: Record<string, any>,
  history: History
) {
  const reduxSagaMonitorOptions = {
    onError: (error: ResponseError) => {
      const message = error.response?.jsonBody?.message ?? error.message
      const notificationTitle = getErrorMessage(error)

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      store.dispatch(
        showGlobalNotification({
          title: notificationTitle,
          message,
          variant: VARIANT_ERROR,
          type: TYPE_GLOBAL,
        })
      )
    },
  }

  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions)

  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware, routerMiddleware(history)]

  let enhancers = applyMiddleware(...middlewares)

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
    enhancers = composeWithDevTools(enhancers)
  }

  const store = createStore(
    createReducer(),
    initialState,
    enhancers
  ) as InjectedStore

  // Extensions
  // eslint-disable-next-line @typescript-eslint/unbound-method
  store.runSaga = sagaMiddleware.run
  store.injectedReducers = {} // Reducer registry
  store.injectedSagas = {} // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers))
    })
  }

  return store
}
