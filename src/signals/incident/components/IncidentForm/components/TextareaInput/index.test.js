import React from 'react';
import { shallow } from 'enzyme';

import TextareaInput from './index';

describe('Form component <TextareaInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here'
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
        updateIncident: jest.fn()
      }
    };

    wrapper = shallow(<TextareaInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render text area field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no text area field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false
        }
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
          updateIncident: true
        }
      });

      wrapper.find('textarea').simulate('change', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo'
      });
    });

    it('does nothing when updateIncident is false', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          updateIncident: false
        }
      });

      wrapper.find('textarea').simulate('change', event);

      expect(parent.meta.updateIncident).not.toHaveBeenCalled();
    });
  });
});
