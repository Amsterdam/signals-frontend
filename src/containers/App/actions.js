import {
  AUTHENTICATE_USER, SHOW_GLOBAL_ERROR
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
