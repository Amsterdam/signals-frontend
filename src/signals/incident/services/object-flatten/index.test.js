import flattenObject from './index';

describe('object flatten', () => {
  it('should flatten an object to a single level deep object', () => {
    expect(flattenObject({
      foo: 'bar',
      abc: {
        def: 42
      }
    })).toEqual({
      foo: 'bar',
      'abc.def': 42
    });
  });

  it('should flatten an object with custom separator', () => {
    expect(flattenObject({
      foo: 'bar',
      abc: {
        def: 42
      }
    }, '', ',')).toEqual({
      foo: 'bar',
      'abc,def': 42
    });
  });
});
