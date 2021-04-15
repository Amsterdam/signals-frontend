// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import * as types from '..';

describe('shared/types', () => {
  const dateValidator = types.dateType;
  const requiredValidator = dateValidator.isRequired;

  it('should handle `date` prop type validation for missing date', () => {
    const props = {
      date: undefined,
    };

    expect(dateValidator(props, 'date', 'MyComponent')).toEqual(null);
    expect(requiredValidator(props, 'date', 'MyComponent')).toBeInstanceOf(Error);
  });

  it('should handle `date` prop type validation for invalid date', () => {
    const props = {
      date: 'not a date',
    };

    expect(dateValidator(props, 'date', 'MyComponent')).toBeInstanceOf(Error);
    expect(requiredValidator(props, 'date', 'MyComponent')).toBeInstanceOf(Error);
  });

  it('should handle `date` prop type validation for valid date', () => {
    const props = {
      date: '2019-10-04',
    };

    expect(dateValidator(props, 'date', 'MyComponent')).toEqual(null);
    expect(requiredValidator(props, 'date', 'MyComponent')).toEqual(null);
  });
});
