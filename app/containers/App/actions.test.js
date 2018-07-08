import {
  AUTHENTICATE_USER
} from './constants';

import {
  authenticateUser,
} from './actions';

describe('App Actions', () => {
  describe('authenticateUser', () => {
    it('should return the correct type', () => {
      const userName = 'name';
      const userScopes = 'scopes';
      const accessToken = 'token';
      const expectedResult = {
        type: AUTHENTICATE_USER,
        payload: {
          userName,
          userScopes,
          accessToken
        }
      };

      expect(authenticateUser(userName, userScopes, accessToken)).toEqual(expectedResult);
    });
  });
});
