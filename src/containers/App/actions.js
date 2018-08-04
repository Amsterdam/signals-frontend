import {
  AUTHENTICATE_USER,
  AUTHORIZE_USER,

  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,

  LOGIN,
  LOGOUT,

  UPLOAD_REQUEST,
  UPLOAD_PROGRESS,
  UPLOAD_SUCCESS,
  UPLOAD_FAILURE
} from './constants';

export function authenticateUser(credentials) {
  return {
    type: AUTHENTICATE_USER,
    payload: credentials
  };
}

export function authorizeUser(credentials) {
  return {
    type: AUTHORIZE_USER,
    payload: credentials
  };
}

export function showGlobalError(message) {
  return {
    type: SHOW_GLOBAL_ERROR,
    payload: message
  };
}

export function resetGlobalError() {
  return {
    type: RESET_GLOBAL_ERROR
  };
}

export function doLogin(domain) {
  return {
    type: LOGIN,
    payload: domain
  };
}

export function doLogout() {
  return {
    type: LOGOUT,
    payload: null
  };
}

export function uploadRequest(payload) {
  return {
    type: UPLOAD_REQUEST,
    payload: {
      file: payload.file.name,
      id: payload.id
    }
  };
}

export function uploadProgress(progress) {
  return {
    type: UPLOAD_PROGRESS,
    payload: { progress }
  };
}

export function uploadSuccess() {
  return {
    type: UPLOAD_SUCCESS
  };
}

export function uploadFailure() {
  return {
    type: UPLOAD_FAILURE
  };
}
