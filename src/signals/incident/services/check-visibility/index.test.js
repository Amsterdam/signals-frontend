import * as auth from 'shared/services/auth/auth';

import checkVisibility from './index';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}));

describe('The check visibility service', () => {
  let control;
  let incident;

  beforeEach(() => {
    control = {
      meta: {},
    };
    incident = {
      category: 'bar',
      subcategory: 'foo',
      color: ['red', 'blue', 'green'],
      object_with_id: {
        id: 'id',
      },
      object_with_value: {
        value: 'value',
      },
      array_with_object_with_id: [{ id: 'id' }],
    };
  });

  it('should show control when authorized', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true);

    control.authenticated = true;
    expect(checkVisibility(control, incident)).toBe(true);
  });

  it('should hide control when not authorized', () => {
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

    control.authenticated = true;
    expect(checkVisibility(control, incident)).toBe(false);
  });

  describe('ifAllOf', () => {
    it('string: should be visible when category and subcategory are valid', () => {
      control.meta.ifAllOf = {
        category: 'bar',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('string: should not be visible when category and subcategory are not valid', () => {
      control.meta.ifAllOf = {
        subcategory: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('array: should be visible when category is valid', () => {
      control.meta.ifAllOf = {
        category: ['bar'],
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('array: should not be visible when category is not valid', () => {
      control.meta.ifAllOf = {
        category: ['bar', 'wrong'],
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('object with id: should be visible when object_with_id is valid', () => {
      control.meta.ifAllOf = {
        object_with_id: 'id',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('object with id: should not be visible when object_with_id is not valid', () => {
      control.meta.ifAllOf = {
        object_with_id: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('object with value: should be visible when object_with_value is valid', () => {
      control.meta.ifAllOf = {
        object_with_value: 'value',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('object with value: should not be visible when object_with_value is not valid', () => {
      control.meta.ifAllOf = {
        object_with_value: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('array with objects with id: should be visible when array_with_object_with_id is valid', () => {
      control.meta.ifAllOf = {
        array_with_object_with_id: 'id',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('array with objects with id: should not be visible when array_with_object_with_id is not valid', () => {
      control.meta.ifAllOf = {
        array_with_object_with_id: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });
  });

  describe('ifOneOf', () => {
    it('string: should be visible when category is valid', () => {
      control.meta.ifOneOf = {
        category: 'bar',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('string: should not be visible when subcategory is not valid', () => {
      control.meta.ifOneOf = {
        subcategory: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('string: should be visible when color is one of array defined', () => {
      control.meta.ifOneOf = {
        color: 'blue',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('string: should not be visible when color is not one of array defined', () => {
      control.meta.ifOneOf = {
        color: 'wrongcolor',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('array: should be visible when category is valid', () => {
      control.meta.ifOneOf = {
        category: ['bar'],
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('array: should be visible when subcategory is valid', () => {
      control.meta.ifOneOf = {
        subcategory: ['foo', 'wrong'],
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('array: should not be visible when subcategory is not valid', () => {
      control.meta.ifOneOf = {
        subcategory: ['wrong', 'wrong'],
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('object with id: should be visible when object_with_id is valid', () => {
      control.meta.ifOneOf = {
        object_with_id: 'id',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('object with id: should not be visible when object_with_id is not valid', () => {
      control.meta.ifOneOf = {
        object_with_id: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('object with value: should be visible when object_with_value is valid', () => {
      control.meta.ifOneOf = {
        object_with_value: 'value',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('object with value: should not be visible when object_with_value is not valid', () => {
      control.meta.ifOneOf = {
        object_with_value: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('array with objects with id: should be visible when array_with_object_with_id is valid', () => {
      control.meta.ifOneOf = {
        array_with_object_with_id: 'id',
      };
      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('array with objects with id: should not be visible when array_with_object_with_id is not valid', () => {
      control.meta.ifOneOf = {
        array_with_object_with_id: 'wrong',
      };
      expect(checkVisibility(control, incident)).toBe(false);
    });
  });

  describe('ifAllOf and ifOneOf', () => {
    it('should pass both', () => {
      expect(checkVisibility(control, incident)).toBe(true);

      control.meta.ifAllOf = {
        category: 'bar',
      };

      control.meta.ifOneOf = {
        object_with_id: 'id',
      };

      expect(checkVisibility(control, incident)).toBe(true);
    });

    it('should pass neither', () => {
      control.meta.ifAllOf = {
        category: ['bar', 'wrong'],
      };

      control.meta.ifOneOf = {
        subcategory: 'wrong',
      };

      expect(checkVisibility(control, incident)).toBe(false);
    });

    it('should return false when ifOneOf is falsy', () => {
      control.meta.ifAllOf = {
        category: 'bar',
      };

      control.meta.ifOneOf = {
        subcategory: 'wrong',
      };

      expect(checkVisibility(control, incident)).toBe(false);
    });
  });
});
