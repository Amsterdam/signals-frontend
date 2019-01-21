import A from './A';
import Concat from './Concat/';
import Ul from './Ul/';

import components from './index';

describe('Definition components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      A,
      Concat,
      Ul
    });
  });
});
