import checkVisibility from './index';

describe('The check visibility service', () => {
  let control;
  let incident;

  beforeEach(() => {
    control = {
      meta: {}
    };
    incident = {
      category: 'bar',
      subcategory: 'foo'
    };
  });

  it('should show control when authorized', () => {
    control.authenticated = true;
    expect(checkVisibility(control, incident, true)).toBeTruthy();
  });

  it('should hide control when not authorized', () => {
    control.authenticated = true;
    expect(checkVisibility(control, incident, false)).toBeFalsy();
  });

  describe('ifAllOf', () => {
    it('string: should be visible when category and subcategory are valid', () => {
      control.meta.ifAllOf = {
        category: 'bar'
      };
      expect(checkVisibility(control, incident)).toBeTruthy();
    });

    it('string: should be visible when category and subcategory are not valid', () => {
      control.meta.ifAllOf = {
        subcategory: 'wrong'
      };
      expect(checkVisibility(control, incident)).toBeFalsy();
    });

    it('array: should be visible when category is valid', () => {
      control.meta.ifAllOf = {
        category: ['bar']
      };
      expect(checkVisibility(control, incident)).toBeTruthy();
    });

    it('array: should be visible when category is not valid', () => {
      control.meta.ifAllOf = {
        category: ['bar', 'wrong']
      };
      expect(checkVisibility(control, incident)).toBeFalsy();
    });
  });

  describe('ifOneOf', () => {
    it('string: should be visible when category is valid', () => {
      control.meta.ifOneOf = {
        category: 'bar'
      };
      expect(checkVisibility(control, incident)).toBeTruthy();
    });

    it('string: should be visible when subcategory is not valid', () => {
      control.meta.ifOneOf = {
        subcategory: 'wrong'
      };
      expect(checkVisibility(control, incident)).toBeFalsy();
    });

    it('array: should be visible when category is valid', () => {
      control.meta.ifOneOf = {
        category: ['bar']
      };
      expect(checkVisibility(control, incident)).toBeTruthy();
    });

    it('array: should be visible when subcategory is valid', () => {
      control.meta.ifOneOf = {
        subcategory: ['foo', 'wrong']
      };
      expect(checkVisibility(control, incident)).toBeTruthy();
    });

    it('array: should be visible when subcategory is not valid', () => {
      control.meta.ifOneOf = {
        subcategory: ['wrong', 'wrong']
      };
      expect(checkVisibility(control, incident)).toBeFalsy();
    });
  });
});
