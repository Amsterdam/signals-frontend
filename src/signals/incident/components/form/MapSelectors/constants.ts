import type { Item } from './types'

export const DETAIL_PANEL_WIDTH = 400
export const UNREGISTERED_TYPE = 'not-on-map'
export const UNKNOWN_TYPE = 'unknown'
export const NEARBY_TYPE = 'nearby'

export const selectionIsObject = (selection: Item) =>
  selection.type !== UNKNOWN_TYPE &&
  selection.type !== UNREGISTERED_TYPE &&
  selection.type !== NEARBY_TYPE

export const selectionIsUndetermined = (selection: Item) =>
  !selectionIsObject(selection)

export const selectionIsNearby = (selection: Item) =>
  selection.type === NEARBY_TYPE
