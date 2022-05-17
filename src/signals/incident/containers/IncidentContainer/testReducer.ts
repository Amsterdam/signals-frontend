import { combineReducers, createStore } from 'redux'
import reducer from './reducer'

export function setupStore() {
  return createStore(combineReducers({ incidentContainer: reducer }))
}
