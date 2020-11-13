import DateTime from './DateTime';
import Image from './Image';
import Map from './Map';
import MapSelectPreview from './MapSelect';
import MapSelectAmsterdamPreview from './MapSelectAmsterdam';

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
      MapSelectAmsterdamPreview,
    });
  });
});
