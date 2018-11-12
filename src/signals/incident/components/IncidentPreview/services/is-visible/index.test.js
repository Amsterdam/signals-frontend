import isVisible from './index';

describe('The is visible service', () => {
  it('by default should be visible', () => {
    expect(isVisible('foo', {})).toBeTruthy();
  });

  it('should be visible when field has authenticated and user is logged in', () => {
    expect(isVisible('foo', { authenticated: true }, true)).toBeTruthy();
  });

  it('should not be visible when field has authenticated and user is logged out', () => {
    expect(isVisible('foo', { authenticated: true }, false)).toBeFalsy();
  });

  it('should be visible when field is optional and valeu is has authenticated and user is logged out', () => {
    expect(isVisible('foo', { optional: true })).toBeTruthy();
  });

  it('should not be visible when field is optional and value is empty', () => {
    expect(isVisible('', { optional: true })).toBeFalsy();
  });
});
