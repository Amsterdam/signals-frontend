import type { Item } from './types'

export const OBJECT_UNKNOWN = 'unknown'
export const OBJECT_NOT_ON_MAP = 'not-on-map' // Note: the value of this constant is used by other SIA instances so it is NOT to be changed

export const selectionIsObject = (item: Item) =>
  item.type !== OBJECT_UNKNOWN && item.type !== OBJECT_NOT_ON_MAP
