import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import TextInput from '.';

describe('Form component <TextInput />', () => {
  const props = {
    meta: {
      name: 'input-field-name',
      type: 'text',
      label: 'field label',
      placeholder: 'type here',
    },
    handler: jest.fn(),
    parent: {
      meta: {
        updateIncident: jest.fn(),
      },
    },
    touched: false,
    hasError: jest.fn(),
    getError: jest.fn(),
  };

  describe('rendering', () => {
    it('should render text field correctly', () => {
      const propsIsNotVisible = {
        ...props,
        meta: {
          ...props.meta,
          isVisible: false,
        },
      };
      const { queryByText, container, rerender } = render(
        withAppContext(<TextInput {...propsIsNotVisible} />)
      );

      expect(queryByText('field label')).not.toBeInTheDocument();
      expect(container.querySelector('input')).not.toBeInTheDocument();

      const propsIsVisible = {
        ...props,
        meta: {
          ...props.meta,
          isVisible: true,
        },
      };

      rerender(
        withAppContext(<TextInput {...propsIsVisible} />)
      );

      expect(queryByText('field label')).toBeInTheDocument();
      expect(container.querySelector('input')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    const event = { target: { value: 'diabolo' } };

    it('sets incident when value changes', () => {
      const propsIsVisible = {
        ...props,
        meta: {
          ...props.meta,
          isVisible: true,
        },
      };
      const { container } = render(
        withAppContext(<TextInput {...propsIsVisible} />)
      );

      fireEvent.blur(container.querySelector('input'), event);

      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        [props.meta.name]: 'diabolo',
      });
    });

    it('sets incident when value changes and removed unwanted characters', () => {
      const propsWithAutoRemove = {
        ...props,
        meta: {
          ...props.meta,
          autoRemove: /[bdl]*/g,
          isVisible: true,
        },
      };
      const { container } = render(
        withAppContext(<TextInput {...propsWithAutoRemove} />)
      );

      fireEvent.blur(container.querySelector('input'), event);

      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        [props.meta.name]: 'iaoo',
      });
    });
  });
});
