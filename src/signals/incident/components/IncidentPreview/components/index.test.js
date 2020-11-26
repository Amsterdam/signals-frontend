import DateTime from './DateTime';
import Image from './Image';
import Map from './Map';
import MapSelectPreview from './MapSelect';
import MapSelectGenericPreview from './MapSelectGeneric';

import components from '.';
import ListObjectValue from './ListObjectValue';

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      DateTime,
      ListObjectValue,
      Image,
      Map,
      MapSelectPreview,
      MapSelectGenericPreview,
    });
  });
});
