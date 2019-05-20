import PlainText from './PlainText/';
import DateTime from './DateTime/';
import Image from './Image/';
import ObjectValue from './ObjectValue/';
import Map from './Map/';

import components from './index';

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      PlainText,
      DateTime,
      Image,
      ObjectValue,
      Map
    });
  });
});
