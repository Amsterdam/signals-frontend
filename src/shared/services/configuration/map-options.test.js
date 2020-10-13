import configuration from 'shared/services/configuration/configuration';

jest.mock('shared/services/configuration/configuration');

describe('shared/services/configuration/map-options', () => {
  afterEach(() => {
    configuration.__reset();
  });

  it('should return an object with configuration props', () => {
    const options = { foo: 'foo', bar: 'bar' };

    configuration.map.options = options;

    // eslint-disable-next-line
    const mapOptions = require('./map-options').default;

    expect(mapOptions).toEqual(expect.objectContaining({
      ...options,
      zoomControl: false,
      crs: expect.objectContaining({}),
      attributionControl: true,
    }));
  });
});
