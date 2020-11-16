import { resolveQuestions } from './services';

const mockedQuestions = [
  {
    key: 'key1',
    meta: {
      metaProp: 'metaProp',
    },
    field_type: 'checkbox_input',
  },
  {
    key: 'key2',
    meta: {
      validators: ['required', ['max_length', 100]],
    },
    field_type: 'radio_input',
  },
  {
    key: 'key3',
    field_type: 'select_input',
    required: true,
  },
  {
    key: 'key4',
    meta: {
      validators: ['required', ['max_length', 100]],
    },
    field_type: 'select_input',
    required: true,
  },
];

describe('The resolve questions service', () => {
  it('should return empty object without questions', () => {
    const result = resolveQuestions([]);
    expect(result).toEqual({});
  });

  it('should return the questions mapped to their key property', () => {
    const result = resolveQuestions(mockedQuestions);
    expect(result).toHaveProperty('key1');
    expect(result).toHaveProperty('key2');
    expect(result).toHaveProperty('key3');
    expect(result).toHaveProperty('key4');
    expect(Object.keys(result).length).toBe(4);
  });

  it('should pass meta prop', () => {
    const result = resolveQuestions(mockedQuestions);
    expect(result.key1).toMatchObject({
      meta: {
        metaProp: 'metaProp',
        pathMerge: 'extra_properties',
      },
    });
    expect(result.key2).toMatchObject({
      meta: {},
    });
  });

  it('should add render prop', () => {
    const result = resolveQuestions(mockedQuestions);
    expect(result.key1).toMatchObject({
      render: 'CheckboxInput',
    });
    expect(result.key2).toMatchObject({
      render: 'RadioInputGroup',
    });
  });

  it('should add options prop with validators', () => {
    const result = resolveQuestions(mockedQuestions);
    expect(result.key1).toMatchObject({
      options: {
        validators: [],
      },
    });
    expect(result.key2).toMatchObject({
      options: {
        validators: ['required', ['maxLength', 100]],
      },
    });
    expect(result.key3).toMatchObject({
      options: {
        validators: ['required'],
      },
    });
    expect(result.key4).toMatchObject({
      options: {
        validators: ['required', ['maxLength', 100]],
      },
    });
  });
});
