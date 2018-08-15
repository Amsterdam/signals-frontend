import React from 'react';
import { shallow } from 'enzyme';

import TextInput from './index';

describe('Form component <TextInput />', () => {
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
        setIncident: jest.fn()
      }
    };

    wrapper = shallow(<TextInput
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
    />);
  });

  describe('rendering', () => {
    it('should render field correctly', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          type: 'text',
          placeholder: 'type here',
          ifVisible: true
        }
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render no text field when not visible', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          type: 'text',
          placeholder: 'type here',
          ifVisible: false
        }
      });

      expect(handler).not.toHaveBeenCalled();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          type: 'text',
          placeholder: 'type here',
          ifVisible: true,
          updateIncident: true
        }
      });

      const event = { target: { value: 'diabolo' } };
      wrapper.find('input').simulate('change', event);

      expect(parent.meta.setIncident).toHaveBeenCalledWith({
        'input-field-name': 'diabolo'
      });
    });

    it('does nothing when updateIncident is false', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          type: 'text',
          placeholder: 'type here',
          ifVisible: true,
          updateIncident: false
        }
      });

      const event = { target: { value: 'diabolo' } };
      wrapper.find('input').simulate('change', event);

      expect(parent.meta.setIncident).not.toHaveBeenCalled();
    });
  });
});
