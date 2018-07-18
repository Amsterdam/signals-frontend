import {
  AUTHENTICATE_USER, SHOW_GLOBAL_ERROR, LOGIN, LOGOUT
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

export function doLogin(domain) {
  console.log('doLogin');
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

