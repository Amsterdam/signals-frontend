import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,
  SHOW_GLOBAL_NOTIFICATION,
  RESET_GLOBAL_NOTIFICATION,
  LOGIN,
  LOGIN_FAILED,
  LOGOUT,
  LOGOUT_FAILED,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
  SET_SEARCH_QUERY,
  RESET_SEARCH_QUERY,
  GET_SOURCES,
  GET_SOURCES_FAILED,
  GET_SOURCES_SUCCESS,
} from './constants';

export const loginFailed = payload => ({
  type: LOGIN_FAILED,
  payload,
});

export const logoutFailed = payload => ({
  type: LOGOUT_FAILED,
  payload,
});

export const authenticateUser = credentials => ({
  type: AUTHENTICATE_USER,
  payload: credentials,
});

export const authorizeUser = payload => ({
  type: AUTHORIZE_USER,
  payload,
});

export const showGlobalNotification = payload => ({
  type: SHOW_GLOBAL_NOTIFICATION,
  payload,
});

export const resetGlobalNotification = () => ({
  type: RESET_GLOBAL_NOTIFICATION,
});

export const doLogin = domain => ({
  type: LOGIN,
  payload: domain,
});

export const doLogout = () => ({
  type: LOGOUT,
  payload: null,
});

export const uploadRequest = ({ file, id }) => ({
  type: UPLOAD_REQUEST,
  payload: { file, id },
});

export const uploadProgress = progress => ({
  type: UPLOAD_PROGRESS,
  payload: progress,
});

export const uploadSuccess = () => ({
  type: UPLOAD_SUCCESS,
});

export const uploadFailure = () => ({
  type: UPLOAD_FAILURE,
});

export const setSearchQuery = payload => ({
  type: SET_SEARCH_QUERY,
  payload,
});

export const resetSearchQuery = () => ({
  type: RESET_SEARCH_QUERY,
});

export const getSources = () => ({
  type: GET_SOURCES,
});

export const getSourcesFailed = payload => ({
  type: GET_SOURCES_FAILED,
  payload,
});

export const getSourcesSuccess = payload => ({
  type: GET_SOURCES_SUCCESS,
  payload,
});
