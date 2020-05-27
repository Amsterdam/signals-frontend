import resolveQuestions from '.';

const mockedQuestions = [
  {
    key: 'key1',
    meta: 'meta1',
    options: 'options1',
    field_type: 'field_type1',
  },
  {
    key: 'key2',
    meta: 'meta2',
    options: 'options2',
    field_type: 'field_type2',
  },
];

describe('The resolve classification service', () => {
  it('should return summary and navigation buttons', () => {
    const result = resolveQuestions([]);
    expect(result).toHaveProperty('custom_text');
    expect(result).toHaveProperty('$field_0');
    expect(Object.keys(result).length).toBe(2);
  });
  it('should return the questions mapped to their key property', () => {
    const result = resolveQuestions(mockedQuestions);
    expect(result).toHaveProperty('key1');
    expect(result).toHaveProperty('key2');
    expect(Object.keys(result).length).toBe(4);
    expect(result.key1).toMatchObject({
      meta: 'meta1',
      options: 'options1',
      render: 'field_type1',
    });
    expect(result.key2).toMatchObject({
      meta: 'meta2',
      options: 'options2',
      render: 'field_type2',
    });
  });
  it('should pass meta and options props and add render prop', () => {
    const result = resolveQuestions(mockedQuestions);
    expect(result.key1).toMatchObject({
      meta: 'meta1',
      options: 'options1',
      render: 'field_type1',
    });
    expect(result.key2).toMatchObject({
      meta: 'meta2',
      options: 'options2',
      render: 'field_type2',
    });
  });
});
