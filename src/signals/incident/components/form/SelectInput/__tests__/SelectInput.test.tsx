// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectInput from '..';
import userEvent from '@testing-library/user-event';
import type { SelectInputProps } from '../SelectInput';

describe('Form component <SelectInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: [{ foo: 'Foo' }, { bar: 'Bar' }, { baz: 'Baz' }],
  };

  const props = {
    handler: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
    },
    touched: false,
    hasError: jest.fn(),
    getError: jest.fn(),
    value: undefined,
  } as SelectInputProps;

  beforeEach(() => {
    (props.handler as jest.Mock).mockImplementation(() => ({
      value: {
        id: 'baz',
        label: 'Baz',
      },
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('rendering', () => {
    it('should render select field correctly', () => {
      const meta = {
        ...metaFields,
        isVisible: true,
      };

      render(<SelectInput meta={meta} {...props} />);

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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      render(<SelectInput meta={meta} {...props} />);

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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      render(<SelectInput meta={meta} {...props} />);

      expect(screen.queryByTestId('input-field-name')).not.toBeInTheDocument();
      expect(screen.queryByTestId('selectedValue')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('sets incident when value changes', () => {
      const meta = {
        ...metaFields,
        isVisible: true,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      render(<SelectInput meta={meta} {...props} />);

      const element = screen.getByTestId('input-field-name');
      expect(element).toBeInTheDocument();
      expect(screen.getByTestId('selectedValue').textContent).toEqual('Baz');

      userEvent.selectOptions(element, 'bar');

      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': {
          id: 'bar',
          label: 'Bar',
        },
      });
      expect(screen.getByTestId('selectedValue').textContent).toEqual('Bar');
    });
  });
});
