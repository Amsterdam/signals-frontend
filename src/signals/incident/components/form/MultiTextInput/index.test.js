import React from 'react';
import { shallow } from 'enzyme';
import Input from 'components/Input';
import Button from 'components/Button';

import MultiTextInput from './index';

describe('Form component <MultiTextInput />', () => {
  const metaFields = {
    name: 'input-field-name',
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
      <MultiTextInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );

    handler.mockImplementation(() => ({
      value: ['Lorem'],
    }));
  });

  describe('rendering', () => {
    it('should render multi text correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          itemClassName: 'col-3',
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render multi text without value correctly', () => {
      handler = handler.mockImplementation(() => ({ value: undefined }));

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no multi text when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = { target: { value: 'Ipsum' } };

    it('should set incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      wrapper.find(Input).simulate('change', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': ['Ipsum'],
      });
    });

    it('should add a text field when button is clicked', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      wrapper.find(Button).simulate('click', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': ['Lorem', ''],
      });
    });

    it('should prevent invalid character input', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      const invalidKeyEvent = { key: '@', preventDefault: jest.fn() };
      const validKeyEvent = { key: '5', preventDefault: jest.fn() };

      wrapper.find(Input).simulate('keypress', invalidKeyEvent);
      wrapper.find(Input).simulate('keypress', validKeyEvent);

      expect(invalidKeyEvent.preventDefault).toHaveBeenCalled();
      expect(validKeyEvent.preventDefault).not.toHaveBeenCalled();
    });
  });
});
