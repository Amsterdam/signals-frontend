import type { Item } from './types'

export const DETAIL_PANEL_WIDTH = 400

export const UNREGISTERED_TYPE = 'not-on-map'

/**
 * @deprecated
 * In 5 years, around 2028 nov/december we'll remove this constant because UNKNOWN_TYPE cannot be added to an incident
 * end of this month. That is around 2023 nov/december.
 */
export const UNKNOWN_TYPE = 'unknown'
export const NEARBY_TYPE = 'nearby'

export const selectionIsObject = (selection: Item) =>
  selection.type !== UNKNOWN_TYPE && selection.type !== UNREGISTERED_TYPE

export const selectionIsUndetermined = (selection: Item) =>
  !selectionIsObject(selection)

export const selectionIsNearby = (selection: Item) =>
  selection.type === NEARBY_TYPE
