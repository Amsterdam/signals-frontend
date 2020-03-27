import { feature2location, location2feature } from './index';

const testLocation = { lng: 4, lat: 52 };

const testFeature = {
  type: 'Point',
  coordinates: [4, 52],
};

describe('feature2location', () => {
  it('should convert', () => {
    expect(feature2location(testFeature)).toEqual(testLocation);
  });
});

describe('location2feature', () => {
  it('should convert', () => {
    expect(location2feature(testLocation)).toEqual(testFeature);
  });
});
