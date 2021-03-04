import React from 'react';
import { render, screen } from '@testing-library/react';
import { withAppContext } from 'test/utils';

import TextInput from '..';
import userEvent from '@testing-library/user-event';

describe('Form component <TextInput />', () => {
  const props = {
    meta: {
      name: 'input-field-name',
      type: 'text',
      label: 'field label',
      placeholder: 'type here',
      subtitle: 'subtitle',
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
    value: '',
  };

  describe('rendering', () => {
    it('should not render when no metadata', () => {
      render(withAppContext(<TextInput {...props} meta={undefined} />));

      expect(screen.queryByText('field label')).not.toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should render text field correctly', () => {
      const propsIsNotVisible = {
        ...props,
        meta: {
          ...props.meta,
          isVisible: false,
        },
      };
      const { rerender } = render(withAppContext(<TextInput {...propsIsNotVisible} />));

      expect(screen.queryByText('field label')).not.toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();

      const propsIsVisible = {
        ...props,
        meta: {
          ...props.meta,
          isVisible: true,
        },
      };

      rerender(withAppContext(<TextInput {...propsIsVisible} />));

      expect(screen.getByText('field label')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('sets incident when value changes', () => {
      const propsIsVisible = {
        ...props,
        meta: {
          ...props.meta,
          isVisible: true,
        },
      };

      render(withAppContext(<TextInput {...propsIsVisible} />));

      const input = screen.getByRole('textbox');
      userEvent.type(input, 'diabolo');
      userEvent.tab();

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
      render(withAppContext(<TextInput {...propsWithAutoRemove} />));

      const input = screen.getByRole('textbox');
      userEvent.type(input, 'diabolo');
      userEvent.tab();

      expect(props.parent.meta.updateIncident).toHaveBeenCalledWith({
        [props.meta.name]: 'iaoo',
      });
    });
  });
});
