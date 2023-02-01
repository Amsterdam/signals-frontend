import invariant from 'invariant'
import conformsTo from 'lodash/conformsTo'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'

import type { InjectedStore } from 'types'

/**
 * Validate the shape of redux store
 */
export default function checkStore(store: Partial<InjectedStore>) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
  }
  invariant(
    conformsTo(store, shape),
    '(src/utils...) injectors: Expected a valid redux store'
  )
}
