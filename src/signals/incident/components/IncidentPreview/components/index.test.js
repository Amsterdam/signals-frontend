import PlainText from './PlainText/';
import DateTime from './DateTime/';
import Image from './Image/';
import KeyValue from './KeyValue/';
import Map from './Map/';

import components from './index';

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      PlainText,
      DateTime,
      Image,
      KeyValue,
      Map
    });
  });
});
