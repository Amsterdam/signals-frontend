import React from 'react';
import { shallow } from 'enzyme';
import { Input } from '@datapunt/asc-ui';

import TextInput from './index';

describe('Form component <TextInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    type: 'text',
    placeholder: 'type here',
  };
  let wrapper;
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

    wrapper = shallow(
      <TextInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );
  });

  describe('rendering', () => {
    it('should render text field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no text field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = { target: { value: 'diabolo' } };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      wrapper.find(Input).simulate('blur', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      });
    });

    it('sets incident when value changes and removed unwanted characters', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          autoRemove: /[dbl]*/g,
          isVisible: true,
        },
      });

      wrapper.find(Input).simulate('blur', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'iaoo',
      });
    });
  });
});
