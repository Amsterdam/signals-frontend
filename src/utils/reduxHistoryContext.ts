import { createReduxHistoryContext } from 'redux-first-history'

import history from './history'

export const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history,
  })
