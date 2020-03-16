import * as auth from 'shared/services/auth/auth';

import isVisible from './index';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}));

describe('The is visible service', () => {
  beforeEach(() => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);
  });

  it('by default should be visible', () => {
    expect(isVisible('foo', {})).toBe(true);
  });

  it('should be visible when field has authenticated and user is logged in', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    expect(isVisible('foo', { authenticated: true })).toBe(true);
  });

  it('should not be visible when field has authenticated and user is logged out', () => {
    expect(isVisible('foo', { authenticated: true })).toBe(false);
  });

  it('should be visible when field is optional and value is has authenticated and user is logged out', () => {
    expect(isVisible('foo', { optional: true })).toBe(true);
  });

  it('should not be visible when field is optional and value is empty', () => {
    expect(isVisible('', { optional: true })).toBe(false);
  });
});
