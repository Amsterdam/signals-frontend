// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { Action } from 'types'
import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,
  SHOW_GLOBAL_NOTIFICATION,
  RESET_GLOBAL_NOTIFICATION,
  LOGIN_FAILED,
  LOGOUT,
  LOGOUT_FAILED,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  SET_SEARCH_QUERY,
  RESET_SEARCH_QUERY,
  GET_SOURCES,
  GET_SOURCES_FAILED,
  GET_SOURCES_SUCCESS,
} from './constants'
import type { GlobalNotification, UserCredentials, User } from './types'

export type LoginFailedAction = Action<typeof LOGIN_FAILED, string>
export type LogoutFailedAction = Action<typeof LOGOUT_FAILED, string>
export type AuthenticateUserAction = Action<
  typeof AUTHENTICATE_USER,
  UserCredentials
>
export type AuthorizeUserAction = Action<typeof AUTHORIZE_USER, User>
export type ShowGlobalNotificationAction = Action<
  typeof SHOW_GLOBAL_NOTIFICATION,
  GlobalNotification
>
export type ResetGlobalNotificationAction = Action<
  typeof RESET_GLOBAL_NOTIFICATION,
  never
>
export type DoLogoutAction = Action<typeof LOGOUT, null>
export type UploadSuccessAction = Action<typeof UPLOAD_SUCCESS, never>
export type UploadProgressAction = Action<typeof UPLOAD_PROGRESS, number>
export type UploadFailureAction = Action<typeof UPLOAD_FAILURE, never>
export type SetSearchQueryAction = Action<typeof SET_SEARCH_QUERY, string>
export type ResetSearchQueryAction = Action<typeof RESET_SEARCH_QUERY, never>
export type GetSourcesAction = Action<typeof GET_SOURCES, never>
export type GetSourcesFailedAction = Action<typeof GET_SOURCES_FAILED, string>
export type GetSourcesSuccessAction = Action<
  typeof GET_SOURCES_SUCCESS,
  string[]
>

export const loginFailed = (payload: string): LoginFailedAction => ({
  type: LOGIN_FAILED,
  payload,
})

export const logoutFailed = (payload: string): LogoutFailedAction => ({
  type: LOGOUT_FAILED,
  payload,
})

export const authenticateUser = (
  credentials: UserCredentials
): AuthenticateUserAction => ({
  type: AUTHENTICATE_USER,
  payload: credentials,
})

export const authorizeUser = (payload: User): AuthorizeUserAction => ({
  type: AUTHORIZE_USER,
  payload,
})

export const showGlobalNotification = (
  payload: GlobalNotification
): ShowGlobalNotificationAction => ({
  type: SHOW_GLOBAL_NOTIFICATION,
  payload,
})

export const resetGlobalNotification = (): ResetGlobalNotificationAction => ({
  type: RESET_GLOBAL_NOTIFICATION,
})

export const doLogout = (): DoLogoutAction => ({
  type: LOGOUT,
  payload: null,
})

export const uploadProgress = (progress: number): UploadProgressAction => ({
  type: UPLOAD_PROGRESS,
  payload: progress,
})

export const uploadSuccess = (): UploadSuccessAction => ({
  type: UPLOAD_SUCCESS,
})

export const uploadFailure = (): UploadFailureAction => ({
  type: UPLOAD_FAILURE,
})

export const setSearchQuery = (payload: string): SetSearchQueryAction => ({
  type: SET_SEARCH_QUERY,
  payload,
})

export const resetSearchQuery = (): ResetSearchQueryAction => ({
  type: RESET_SEARCH_QUERY,
})

export const getSources = (): GetSourcesAction => ({
  type: GET_SOURCES,
})

export const getSourcesFailed = (payload: string): GetSourcesFailedAction => ({
  type: GET_SOURCES_FAILED,
  payload,
})

export const getSourcesSuccess = (
  payload: string[]
): GetSourcesSuccessAction => ({
  type: GET_SOURCES_SUCCESS,
  payload,
})

export type AppActionTypes =
  | LoginFailedAction
  | LogoutFailedAction
  | AuthenticateUserAction
  | AuthorizeUserAction
  | ShowGlobalNotificationAction
  | ResetGlobalNotificationAction
  | DoLogoutAction
  | UploadSuccessAction
  | UploadProgressAction
  | UploadFailureAction
  | SetSearchQueryAction
  | ResetSearchQueryAction
  | GetSourcesAction
  | GetSourcesFailedAction
  | GetSourcesSuccessAction
