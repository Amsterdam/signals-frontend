// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import { render, screen } from '@testing-library/react';
import Select from 'components/Select';
import SelectInput from '.';
import userEvent from '@testing-library/user-event';

describe('Form component <SelectInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: [
      { foo: 'Foo' },
      { bar: 'Bar' },
      { baz: 'Baz' },
    ],
  };
  let handler;
  let touched;
  let getError;
  let hasError;
  let parent;

  beforeEach(() => {
    handler = jest.fn();
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();
    parent = {
      meta: {
        updateIncident: jest.fn(),
      },
    };

    handler.mockImplementation(() => ({
      value: {
        id: 'baz',
        label: 'Baz',
      },
    }));
  });

  describe('rendering', () => {
    it('should render select field correctly', () => {
      const meta = {
        ...metaFields,
        isVisible: true,
      };
      render(<SelectInput meta={meta} handler={handler} parent={parent} touched={touched} hasError={hasError} getError={getError} />);

      const element = screen.getByTestId('input-field-name');
      expect(element).toBeInTheDocument();
      expect(element.querySelectorAll('option').length).toEqual(metaFields.values.length);
      expect(screen.getByTestId('selectedValue')).toBeInTheDocument();
      expect(screen.getByTestId('selectedValue').textContent).toEqual('Baz');
    });

    it('should render empty select field when values are not supplied', () => {
      const meta = {
        ...metaFields,
        isVisible: true,
        values: null,
      };

      render(<SelectInput meta={meta} handler={handler} parent={parent} touched={touched} hasError={hasError} getError={getError} />);

      const element = screen.getByTestId('input-field-name');
      expect(element).toBeInTheDocument();
      expect(element.querySelectorAll('option').length).toEqual(0);
      expect(screen.getByTestId('selectedValue')).toBeInTheDocument();
      expect(screen.getByTestId('selectedValue').textContent).toEqual('');
    });

    it('should render no select field when not visible', () => {
      const meta = {
        ...metaFields,
        isVisible: false,
      };

      render(<SelectInput meta={meta} handler={handler} parent={parent} touched={touched} hasError={hasError} getError={getError} />);

      expect(screen.queryByTestId('input-field-name')).not.toBeInTheDocument();
      expect(screen.queryByTestId('selectedValue')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    const event = {
      target: {
        selectedIndex: 2,
        2: {
          text: 'Baz',
        },
        value: 'baz',
      },
    };

    it('sets incident when value changes', () => {
      const meta = {
        ...metaFields,
        isVisible: true,
      };

      render(<SelectInput meta={meta} handler={handler} parent={parent} touched={touched} hasError={hasError} getError={getError} />);

      const element = screen.getByTestId('input-field-name');
      expect(element).toBeInTheDocument();
      expect(screen.getByTestId('selectedValue').textContent).toEqual('Baz');


      userEvent.selectOptions(element, 'bar');

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': {
          id: 'bar',
          label: 'Bar',
        },
      });
      expect(screen.getByTestId('selectedValue').textContent).toEqual('Bar');
    });
  });
});
