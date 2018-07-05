import {
  AUTHENTICATE_USER
} from './constants';

import {
  authenticateUser,
} from './actions';

describe('App Actions', () => {
  describe('authenticateUser', () => {
    it('should return the correct type', () => {
      const expectedResult = {
        type: AUTHENTICATE_USER,
      };

      expect(authenticateUser()).toEqual(expectedResult);
    });
  });
});
