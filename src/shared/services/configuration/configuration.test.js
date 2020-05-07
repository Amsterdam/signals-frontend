global.window.CONFIG = {
  foo: 'bar',
  baz: 'qux',
};

const configuration = require('./configuration').default;

describe('shared/services/configuration/configuration', () => {
  it('should return a config prop', () => {
    expect(configuration).toHaveProperty('foo');
    expect(configuration.baz).toEqual('qux');

    // destructuring should also work
    const { foo } = configuration;
    expect(foo).toEqual('bar');
  });

  it('should throw an error for missing props', () => {
    expect(() => {
      // eslint-disable-next-line
      const missingProp = configuration.missing;
    }).toThrow();
  });
});
