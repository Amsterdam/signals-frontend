import convertValue from '.';

describe('The convert value service', () => {
  it('should return undefined by default', () => {
    expect(convertValue()).toBeUndefined();
  });

  it('should return text', () => {
    expect(convertValue('This is a beautiful phrase')).toBe('This is a beautiful phrase');
  });

  it('should return 0', () => {
    expect(convertValue(0)).toBe(0);
  });

  it('should return "ja"', () => {
    expect(convertValue(true)).toBe('ja');
  });

  it('should return "nee"', () => {
    expect(convertValue(false)).toBe('nee');
  });

  it('should pass through an array', () => {
    const array = [42, 'foo', 'bar'];
    expect(convertValue(array)).toBe(array);
  });

  it('should pass through an object', () => {
    const object = {
      foo: 1,
      bar: {
        x: 42,
        y: 42,
      },
    };
    expect(convertValue(object)).toBe(object);
  });

  it('should convert the array when props are specified', () => {
    const array = [
      {
        foo: 1,
        bar: 1,
      },
      {
        foo: 2,
        bar: 2,
      },
    ];

    const propertyNames = ['bar'];
    expect(convertValue(array, propertyNames)).toEqual([{ bar: 1 }, { bar: 2 }]);
  });
});
