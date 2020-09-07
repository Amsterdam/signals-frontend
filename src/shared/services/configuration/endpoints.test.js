import mockedEndpoints from './__mocks__/endpoints.json';

const { prefixEndpoints } = require('./endpoints');

jest.mock('./endpoints.json', () => mockedEndpoints, { virtual: true });

describe('shared/services/configuration/endpoints', () => {
  it('should prefix all entries', () => {
    const actual = prefixEndpoints('prefix');
    expect(actual.ENDPOINT_1).toBe('prefix/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('prefix/endpoint/2');
  });

  it('should work with empty prefix', () => {
    const actual = prefixEndpoints('');
    expect(actual.ENDPOINT_1).toBe('/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('/endpoint/2');
  });

  it('should work with null prefix', () => {
    const actual = prefixEndpoints(null);
    expect(actual.ENDPOINT_1).toBe('/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('/endpoint/2');
  });

  it('should work with undefined prefix', () => {
    const actual = prefixEndpoints();
    expect(actual.ENDPOINT_1).toBe('/endpoint/1');
    expect(actual.ENDPOINT_2).toBe('/endpoint/2');
  });
});
