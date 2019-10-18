import CommaArray from './CommaArray';
import PlainText from './PlainText';
import DateTime from './DateTime';
import Image from './Image';
import ObjectValue from './ObjectValue';
import Map from './Map';
import MapSelectPreview from './MapSelect';

import components from './index';
import ListObjectValue from './ListObjectValue';

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      CommaArray,
      PlainText,
      DateTime,
      ListObjectValue,
      Image,
      ObjectValue,
      Map,
      MapSelectPreview,
    });
  });
});
