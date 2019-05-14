import isVisible from './index';

describe('The is visible service', () => {
  it('by default should be visible', () => {
    expect(isVisible('foo', {})).toBe(true);
  });

  it('should be visible when field has authenticated and user is logged in', () => {
    expect(isVisible('foo', { authenticated: true }, true)).toBe(true);
  });

  it('should not be visible when field has authenticated and user is logged out', () => {
    expect(isVisible('foo', { authenticated: true }, false)).toBe(false);
  });

  it('should be visible when field is optional and value is has authenticated and user is logged out', () => {
    expect(isVisible('foo', { optional: true })).toBe(true);
  });

  it('should not be visible when field is optional and value is empty', () => {
    expect(isVisible('', { optional: true })).toBe(false);
  });
});
