import {
  AUTHENTICATE_USER,
} from './constants';

export function authenticateUser(userName, userScopes, accessToken) {
  return {
    type: AUTHENTICATE_USER,
    payload: {
      userName,
      userScopes,
      accessToken
    }
  };
}
