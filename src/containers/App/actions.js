import {
  AUTHENTICATE_USER,
  SHOW_GLOBAL_ERROR,
  RESET_GLOBAL_ERROR,
  LOGIN,
  LOGOUT
} from './constants';

export function authenticateUser(credentials) {
  return {
    type: AUTHENTICATE_USER,
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
