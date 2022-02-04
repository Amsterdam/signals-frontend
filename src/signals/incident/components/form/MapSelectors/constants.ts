import type { Item } from './types'

export const UNREGISTERED_TYPE = 'not-on-map'
export const UNKNOWN_TYPE = 'unknown'

export const selectionIsObject = (selection: Item) =>
  selection.type !== UNKNOWN_TYPE && selection.type !== UNREGISTERED_TYPE

export const selectionIsUndetermined = (selection: Item) =>
  !selectionIsObject(selection)
