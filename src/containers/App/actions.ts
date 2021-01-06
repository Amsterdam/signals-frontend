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
} from './constants';
import type { GlobalNotification, UserCredentials, User } from './types';

export const loginFailed = (payload: string) => ({
  type: LOGIN_FAILED,
  payload,
});

export const logoutFailed = (payload: string) => ({
  type: LOGOUT_FAILED,
  payload,
});

export const authenticateUser = (credentials: UserCredentials) => ({
  type: AUTHENTICATE_USER,
  payload: credentials,
});

export const authorizeUser = (payload: User) => ({
  type: AUTHORIZE_USER,
  payload,
});

export const showGlobalNotification = (payload: Partial<GlobalNotification>) => ({
  type: SHOW_GLOBAL_NOTIFICATION,
  payload,
});

export const resetGlobalNotification = () => ({
  type: RESET_GLOBAL_NOTIFICATION,
});

export const doLogout = () => ({
  type: LOGOUT,
  payload: null,
});

export const uploadProgress = (progress: number) => ({
  type: UPLOAD_PROGRESS,
  payload: progress,
});

export const uploadSuccess = () => ({
  type: UPLOAD_SUCCESS,
});

export const uploadFailure = () => ({
  type: UPLOAD_FAILURE,
});

export const setSearchQuery = (payload: string) => ({
  type: SET_SEARCH_QUERY,
  payload,
});

export const resetSearchQuery = () => ({
  type: RESET_SEARCH_QUERY,
});

export const getSources = () => ({
  type: GET_SOURCES,
});

export const getSourcesFailed = (payload: string) => ({
  type: GET_SOURCES_FAILED,
  payload,
});

export const getSourcesSuccess = (payload: string[]) => ({
  type: GET_SOURCES_SUCCESS,
  payload,
});
