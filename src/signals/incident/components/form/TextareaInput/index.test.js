import React from 'react';
import { shallow } from 'enzyme';
import TextArea from 'components/TextArea';

import TextareaInput from '.';

describe('Form component <TextareaInput />', () => {
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
      <TextareaInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );
  });

  describe('rendering', () => {
    it('should render text area field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no text area field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render character counter correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          maxLength: 300,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render character counter with value correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          maxLength: 300,
        },
        value: 'test',
      });

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

      wrapper.find(TextArea).simulate('blur', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo',
      });
    });

    it('sets incident when value changes and removed unwanted characters', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          autoRemove: /[aio]*/g,
          isVisible: true,
        },
      });

      wrapper.find(TextArea).simulate('blur', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'dbl',
      });
    });
  });
});
