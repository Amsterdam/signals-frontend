import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,
  SHOW_GLOBAL_NOTIFICATION,
  RESET_GLOBAL_NOTIFICATION,
  LOGIN,
  LOGIN_FAILED,
  LOGOUT,
  LOGOUT_FAILED,
  REQUEST_CATEGORIES,
  REQUEST_CATEGORIES_SUCCESS,
  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE,
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

export const requestCategories = () => ({
  type: REQUEST_CATEGORIES,
});

export const requestCategoriesSuccess = categories => ({
  type: REQUEST_CATEGORIES_SUCCESS,
  payload: categories,
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
