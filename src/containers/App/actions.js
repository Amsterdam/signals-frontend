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

export function authenticateUser(credentials) {
  return {
    type: AUTHENTICATE_USER,
    payload: credentials,
  };
}

export function authorizeUser(credentials) {
  return {
    type: AUTHORIZE_USER,
    payload: credentials,
  };
}

export function showGlobalNotification(type, title, message) {
  return {
    type: SHOW_GLOBAL_NOTIFICATION,
    payload: {
      message,
      title,
      type,
    },
  };
}

export function resetGlobalNotification() {
  return {
    type: RESET_GLOBAL_NOTIFICATION,
  };
}

export function doLogin(domain) {
  return {
    type: LOGIN,
    payload: domain,
  };
}

export function doLogout() {
  return {
    type: LOGOUT,
    payload: null,
  };
}

export function requestCategories() {
  return {
    type: REQUEST_CATEGORIES,
  };
}

export function requestCategoriesSuccess(categories) {
  return {
    type: REQUEST_CATEGORIES_SUCCESS,
    payload: categories,
  };
}

export function uploadRequest({ file, id }) {
  return {
    type: UPLOAD_REQUEST,
    payload: { file, id },
  };
}

export function uploadProgress(progress) {
  return {
    type: UPLOAD_PROGRESS,
    payload: progress,
  };
}

export function uploadSuccess() {
  return {
    type: UPLOAD_SUCCESS,
  };
}

export function uploadFailure() {
  return {
    type: UPLOAD_FAILURE,
  };
}
