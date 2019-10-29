import Anchor from './Anchor';
import Concat from './Concat';
import Ul from './Ul';

import components from './index';

describe('Definition components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      Anchor,
      Concat,
      Ul,
    });
  });
});
