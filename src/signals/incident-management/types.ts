import type { SAVE_FILTER, UPDATE_FILTER } from './constants'

export type SaveFilterAction = {
  type: typeof SAVE_FILTER
  payload: any
}

export type UpdateFilterAction = {
  type: typeof UPDATE_FILTER
  payload: any
}

export type PageActions = SaveFilterAction | UpdateFilterAction
