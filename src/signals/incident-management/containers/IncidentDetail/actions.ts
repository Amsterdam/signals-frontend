import type { Action } from 'types'
import type { FetchError } from 'hooks/useFetch'
import type {
  Incident,
  State,
  IncidentChild,
  HistoryEntry,
  Attachment,
  Result,
} from './types'
import type {
  RESET,
  CLOSE_ALL,
  SET_ERROR,
  SET_ATTACHMENTS,
  SET_HISTORY,
  SET_CHILDREN,
  SET_CHILDREN_HISTORY,
  SET_DEFAULT_TEXTS,
  SET_INCIDENT,
  PATCH_START,
  PATCH_SUCCESS,
  PREVIEW,
  EDIT,
} from './constants'

export type ResetAction = Action<typeof RESET, void>
export type CloseAllAction = Action<typeof CLOSE_ALL, void>
export type SetErrorAction = Action<
  typeof SET_ERROR,
  boolean | FetchError | undefined
>
export type SetAttachmentsAction = Action<
  typeof SET_ATTACHMENTS,
  Result<Attachment>
>
export type SetHistoryAction = Action<typeof SET_HISTORY, HistoryEntry[]>
export type SetChildrenAction = Action<
  typeof SET_CHILDREN,
  Result<IncidentChild>
>
export type SetChildrenHistoryAction = Action<
  typeof SET_CHILDREN_HISTORY,
  HistoryEntry[][]
>
export type SetDefaultTextsAction = Action<typeof SET_DEFAULT_TEXTS, string[]>
export type SetIncidentAction = Action<typeof SET_INCIDENT, Incident>
export type PatchStartAction = Action<typeof PATCH_START, string>
export type PatchSuccessAction = Action<typeof PATCH_SUCCESS, string>
export type PreviewAction = Action<typeof PREVIEW, Partial<State>>
export type EditAction = Action<typeof EDIT, Partial<State>>

export type IncidentDetailAction =
  | ResetAction
  | CloseAllAction
  | SetErrorAction
  | SetAttachmentsAction
  | SetHistoryAction
  | SetChildrenAction
  | SetChildrenHistoryAction
  | SetDefaultTextsAction
  | SetIncidentAction
  | PatchStartAction
  | PatchSuccessAction
  | PreviewAction
  | EditAction
